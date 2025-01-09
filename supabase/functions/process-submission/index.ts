import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const submissionId = formData.get('submissionId')
    const templateId = formData.get('templateId')
    const formDataJson = formData.get('formData')

    if (!submissionId || !templateId || !formDataJson) {
      throw new Error('Missing required data')
    }

    const data = JSON.parse(formDataJson.toString())

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the template file
    const { data: templates, error: templateError } = await supabase
      .from('master_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError) throw templateError

    // Download the template file
    const { data: templateFile, error: downloadError } = await supabase.storage
      .from('sqa_files')
      .download(templates.file_path)

    if (downloadError) throw downloadError

    // Load the template workbook
    const workbook = XLSX.read(await templateFile.arrayBuffer(), { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Write form data to specific cells in the template
    // Facility info
    XLSX.utils.sheet_add_aoa(worksheet, [[data.facility]], { origin: 'B3' })
    XLSX.utils.sheet_add_aoa(worksheet, [[data.date]], { origin: 'B4' })
    XLSX.utils.sheet_add_aoa(worksheet, [[data.technician]], { origin: 'B5' })
    XLSX.utils.sheet_add_aoa(worksheet, [[data.serialNumber]], { origin: 'B6' })

    // Lower Limit Detection
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.lowerLimitDetection.conc[i],
        data.lowerLimitDetection.msc[i]
      ]], { origin: `B${12 + i}` })
    }

    // Precision Level 1
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.precisionLevel1.conc[i],
        data.precisionLevel1.motility[i],
        data.precisionLevel1.morph[i]
      ]], { origin: `B${24 + i}` })
    }

    // Precision Level 2
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.precisionLevel2.conc[i],
        data.precisionLevel2.motility[i],
        data.precisionLevel2.morph[i]
      ]], { origin: `B${36 + i}` })
    }

    // Accuracy data
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.accuracy.sqa[i],
        data.accuracy.manual[i],
        data.accuracy.sqaMotility[i],
        data.accuracy.manualMotility[i],
        data.accuracy.sqaMorph[i],
        data.accuracy.manualMorph[i]
      ]], { origin: `A${48 + i}` })
    }

    // QC data
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.qc.level1[i],
        data.qc.level2[i]
      ]], { origin: `B${71 + i}` })
    }

    // Generate filename based on the format you specified
    const dateStr = new Date(data.date).toISOString().split('T')[0]
    const fileName = `Salesforce account name – SN ${data.serialNumber} Precision Lower Limit Detection Study ${dateStr}.xlsx`

    // Convert the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })

    // Upload the filled template
    const { error: uploadError } = await supabase.storage
      .from('sqa_files')
      .upload(`submissions/${fileName}`, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Create file record
    const { error: fileError } = await supabase
      .from('files')
      .insert({
        submission_id: submissionId,
        file_name: fileName,
        file_type: 'excel',
        file_path: `submissions/${fileName}`,
        file_size: excelBuffer.length
      })

    if (fileError) throw fileError

    return new Response(
      JSON.stringify({ 
        message: 'Submission processed successfully',
        fileName,
        filePath: `submissions/${fileName}`
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error processing submission:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})