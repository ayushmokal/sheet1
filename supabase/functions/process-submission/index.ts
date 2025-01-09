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

    // Write form data to specific ranges
    // Facility info (B3:B6)
    XLSX.utils.sheet_add_aoa(worksheet, [
      [data.facility],
      [data.date],
      [data.technician],
      [data.serialNumber]
    ], { origin: 'B3' })

    // Lower Limit Detection (B12:C16)
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.lowerLimitDetection.conc[i] || '1',
        data.lowerLimitDetection.msc[i] || '1'
      ]], { origin: `B${12 + i}` })
    }

    // Precision Level 1 (B24:D28)
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.precisionLevel1.conc[i] || '1',
        data.precisionLevel1.motility[i] || '1',
        data.precisionLevel1.morph[i] || '1'
      ]], { origin: `B${24 + i}` })
    }

    // Precision Level 2 (B36:D40)
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.precisionLevel2.conc[i] || '1',
        data.precisionLevel2.motility[i] || '1',
        data.precisionLevel2.morph[i] || '1'
      ]], { origin: `B${36 + i}` })
    }

    // Accuracy (A48:F52)
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        i + 1,
        data.accuracy.sqa[i] || '1',
        data.accuracy.manual[i] || '1',
        data.accuracy.sqaMotility[i] || '1',
        data.accuracy.manualMotility[i] || '1',
        data.accuracy.sqaMorph[i] || '1',
        data.accuracy.manualMorph[i] || '1'
      ]], { origin: `A${48 + i}` })
    }

    // QC (B71:C75)
    for (let i = 0; i < 5; i++) {
      XLSX.utils.sheet_add_aoa(worksheet, [[
        data.qc.level1[i] || '1',
        data.qc.level2[i] || '1'
      ]], { origin: `B${71 + i}` })
    }

    // Generate the filled template
    const filledTemplate = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })

    // Create a new filename for the filled template
    const dateStr = new Date(data.date).toISOString().split('T')[0]
    const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${dateStr}_${sanitizedFacility}_${data.serialNumber}.xlsx`

    // Upload the filled template
    const { error: uploadError } = await supabase.storage
      .from('sqa_files')
      .upload(`submissions/${fileName}`, filledTemplate, {
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
        file_size: filledTemplate.length
      })

    if (fileError) throw fileError

    return new Response(
      JSON.stringify({ 
        message: 'Submission processed successfully',
        fileName
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