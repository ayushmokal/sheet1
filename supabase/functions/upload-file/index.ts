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
    const file = formData.get('file')
    const submissionId = formData.get('submissionId')
    const fileType = formData.get('fileType')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the latest master template
    const { data: templates, error: templateError } = await supabase
      .from('master_templates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (templateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to get master template', details: templateError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const masterTemplate = templates[0]
    if (!masterTemplate) {
      return new Response(
        JSON.stringify({ error: 'No master template found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Download the master template
    const { data: templateData, error: downloadError } = await supabase.storage
      .from('sqa_files')
      .download(masterTemplate.file_path)

    if (downloadError) {
      return new Response(
        JSON.stringify({ error: 'Failed to download master template', details: downloadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create a new file name for the submission copy
    const sanitizedFileName = file.name.replace(/[^\x00-\x7F]/g, '')
    const fileExt = sanitizedFileName.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sqa_files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Insert file record
    const { error: dbError } = await supabase
      .from('files')
      .insert({
        submission_id: submissionId,
        file_name: sanitizedFileName,
        file_type: fileType,
        file_path: filePath,
        file_size: file.size
      })

    if (dbError) {
      return new Response(
        JSON.stringify({ error: 'Failed to save file metadata', details: dbError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully', 
        filePath,
        templatePath: masterTemplate.file_path 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})