import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

export async function getActiveTemplate(supabase: any) {
  console.log('Fetching active template...');
  
  const { data: templates, error } = await supabase
    .from('master_templates')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching active template:', error);
    throw new Error(`Failed to get active template: ${error.message}`);
  }
  
  if (!templates) {
    console.error('No active template found');
    throw new Error('No active template found in the database');
  }
  
  console.log('Successfully fetched active template:', templates.id);
  return templates;
}

export async function downloadTemplate(supabase: any, filePath: string) {
  console.log('Downloading template:', filePath);
  
  const { data, error } = await supabase
    .storage
    .from('sqa_files')
    .download(filePath);

  if (error) {
    console.error('Error downloading template:', error);
    throw new Error(`Failed to download template: ${error.message}`);
  }

  console.log('Successfully downloaded template');
  return data;
}

export function generateFileName(facility: string, serialNumber: string, date: string): string {
  // Sanitize inputs
  const sanitizedFacility = facility.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedSerial = serialNumber.replace(/[^a-zA-Z0-9]/g, '_');
  const timestamp = new Date().getTime();
  
  return `submissions/${sanitizedFacility}_${sanitizedSerial}_${date}_${timestamp}.xlsx`;
}

export function writeFormDataToWorksheet(workbook: XLSX.WorkBook, data: any) {
  // Get the first worksheet
  const wsname = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[wsname];

  // Helper function to update cell value while preserving formatting
  const updateCell = (cellRef: string, value: any) => {
    const cell = worksheet[cellRef] || {};
    const newCell = {
      ...cell,
      v: value, // raw value
      w: value?.toString() // formatted text
    };
    worksheet[cellRef] = newCell;
  };

  try {
    console.log('Writing form data to worksheet...');

    // Update facility info (B3:B6)
    updateCell('B3', data.facility);
    updateCell('B4', data.date);
    updateCell('B5', data.technician);
    updateCell('B6', data.serialNumber);

    // Update Lower Limit Detection (B12:C16)
    for (let i = 0; i < 5; i++) {
      updateCell(`B${12 + i}`, data.lowerLimitDetection?.conc?.[i] || '1');
      updateCell(`C${12 + i}`, data.lowerLimitDetection?.msc?.[i] || '1');
    }

    // Update Precision Level 1 (B24:D28)
    for (let i = 0; i < 5; i++) {
      updateCell(`B${24 + i}`, data.precisionLevel1?.conc?.[i] || '1');
      updateCell(`C${24 + i}`, data.precisionLevel1?.motility?.[i] || '1');
      updateCell(`D${24 + i}`, data.precisionLevel1?.morph?.[i] || '1');
    }

    // Update Precision Level 2 (B36:D40)
    for (let i = 0; i < 5; i++) {
      updateCell(`B${36 + i}`, data.precisionLevel2?.conc?.[i] || '1');
      updateCell(`C${36 + i}`, data.precisionLevel2?.motility?.[i] || '1');
      updateCell(`D${36 + i}`, data.precisionLevel2?.morph?.[i] || '1');
    }

    // Update Accuracy data (A48:F52)
    for (let i = 0; i < 5; i++) {
      updateCell(`A${48 + i}`, data.accuracy?.sqa?.[i] || '1');
      updateCell(`B${48 + i}`, data.accuracy?.manual?.[i] || '1');
      updateCell(`C${48 + i}`, data.accuracy?.sqaMotility?.[i] || '1');
      updateCell(`D${48 + i}`, data.accuracy?.manualMotility?.[i] || '1');
      updateCell(`E${48 + i}`, data.accuracy?.sqaMorph?.[i] || '1');
      updateCell(`F${48 + i}`, data.accuracy?.manualMorph?.[i] || '1');
    }

    // Update QC data (B71:C75)
    for (let i = 0; i < 5; i++) {
      updateCell(`B${71 + i}`, data.qc?.level1?.[i] || '1');
      updateCell(`C${71 + i}`, data.qc?.level2?.[i] || '1');
    }

    console.log('Successfully wrote form data while preserving formatting');
    return workbook;
  } catch (error) {
    console.error('Error writing data to worksheet:', error);
    throw new Error(`Failed to write data to worksheet: ${error.message}`);
  }
}