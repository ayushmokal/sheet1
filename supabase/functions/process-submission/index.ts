import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'
import { corsHeaders } from './utils/corsHeaders.ts'
import { getActiveTemplate, downloadTemplate, generateFileName } from './utils/templateHandler.ts'
import { writeFormDataToWorksheet } from './utils/excelWriter.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Processing submission request...')
    
    const formData = await req.formData()
    const submissionId = formData.get('submissionId')
    const formDataJson = formData.get('formData')

    if (!submissionId || !formDataJson) {
      throw new Error('Missing required form data')
    }

    console.log('Parsing form data...')
    const data = JSON.parse(formDataJson.toString())

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get active template and download it
    const template = await getActiveTemplate(supabase)
    const templateFile = await downloadTemplate(supabase, template.file_path)

    console.log('Processing template...')
    const workbook = XLSX.read(await templateFile.arrayBuffer(), { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Write form data to worksheet
    writeFormDataToWorksheet(worksheet, data)

    console.log('Converting workbook to buffer...')
    const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })

    // Generate filename and upload filled template
    const fileName = generateFileName(data.facility, data.serialNumber, data.date)
    console.log('Uploading filled template:', fileName)

    const { error: uploadError } = await supabase.storage
      .from('sqa_files')
      .upload(`submissions/${fileName}`, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Failed to upload filled template: ' + uploadError.message)
    }

    console.log('Creating file record...')
    const { error: fileError } = await supabase
      .from('files')
      .insert({
        submission_id: submissionId,
        file_name: fileName,
        file_type: 'excel',
        file_path: `submissions/${fileName}`,
        file_size: excelBuffer.length
      })

    if (fileError) {
      console.error('File record creation error:', fileError)
      throw new Error('Failed to create file record: ' + fileError.message)
    }

    console.log('Submission processed successfully')
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
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
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