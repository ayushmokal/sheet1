import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

export async function getActiveTemplate(supabase: ReturnType<typeof createClient>) {
  console.log('Fetching active template...');
  const { data: templates, error: templateError } = await supabase
    .from('master_templates')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1);

  if (templateError) {
    console.error('Template fetch error:', templateError);
    throw new Error('Failed to fetch template: ' + templateError.message);
  }

  if (!templates || templates.length === 0) {
    throw new Error('No active master template found');
  }

  return templates[0];
}

export async function downloadTemplate(supabase: ReturnType<typeof createClient>, filePath: string) {
  console.log('Downloading template file:', filePath);
  const { data: templateFile, error: downloadError } = await supabase.storage
    .from('sqa_files')
    .download(filePath);

  if (downloadError) {
    console.error('Template download error:', downloadError);
    throw new Error('Failed to download template: ' + downloadError.message);
  }

  if (!templateFile) {
    throw new Error('Template file is empty');
  }

  return templateFile;
}

export function generateFileName(facility: string, serialNumber: string, date: string) {
  const dateStr = new Date(date).toISOString().split('T')[0];
  return `${facility} – SN ${serialNumber} Precision Lower Limit Detection Study ${dateStr}.xlsx`;
}