import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Create a new filename for the submission
    const dateStr = new Date(data.date).toISOString().split('T')[0]
    const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '_')
    const fileName = `${dateStr}_${sanitizedFacility}_${data.serialNumber}.xlsx`

    // Upload the processed file
    const { error: uploadError } = await supabase.storage
      .from('sqa_files')
      .upload(`submissions/${fileName}`, templateFile, {
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
        file_size: templateFile.size
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