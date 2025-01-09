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

export function generateFileName(facility: string, serialNumber: string, date: string): string {
  // Sanitize individual components
  const sanitizedFacility = facility.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedSerialNumber = serialNumber.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedDate = date.replace(/[^0-9-]/g, '_');

  // Generate a timestamp to ensure uniqueness
  const timestamp = new Date().getTime();

  // Construct the filename with sanitized components
  return `submissions/${sanitizedFacility}_SN_${sanitizedSerialNumber}_Precision_Lower_Limit_Detection_Study_${sanitizedDate}_${timestamp}.xlsx`;
}