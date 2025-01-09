import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

export function writeFormDataToWorksheet(worksheet: XLSX.WorkSheet, data: any) {
  try {
    console.log('Writing form data to worksheet...');
    
    // Facility info
    XLSX.utils.sheet_add_aoa(worksheet, [[data.facility]], { origin: 'B3' });
    XLSX.utils.sheet_add_aoa(worksheet, [[data.date]], { origin: 'B4' });
    XLSX.utils.sheet_add_aoa(worksheet, [[data.technician]], { origin: 'B5' });
    XLSX.utils.sheet_add_aoa(worksheet, [[data.serialNumber]], { origin: 'B6' });

    // Lower Limit Detection
    for (let i = 0; i < 5; i++) {
      const concValue = data.lowerLimitDetection?.conc?.[i] || '';
      const mscValue = data.lowerLimitDetection?.msc?.[i] || '';
      XLSX.utils.sheet_add_aoa(worksheet, [[concValue, mscValue]], { origin: `B${12 + i}` });
    }

    // Precision Level 1
    for (let i = 0; i < 5; i++) {
      const values = [
        data.precisionLevel1?.conc?.[i] || '',
        data.precisionLevel1?.motility?.[i] || '',
        data.precisionLevel1?.morph?.[i] || ''
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [values], { origin: `B${24 + i}` });
    }

    // Precision Level 2
    for (let i = 0; i < 5; i++) {
      const values = [
        data.precisionLevel2?.conc?.[i] || '',
        data.precisionLevel2?.motility?.[i] || '',
        data.precisionLevel2?.morph?.[i] || ''
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [values], { origin: `B${36 + i}` });
    }

    // Accuracy data
    for (let i = 0; i < 5; i++) {
      const values = [
        data.accuracy?.sqa?.[i] || '',
        data.accuracy?.manual?.[i] || '',
        data.accuracy?.sqaMotility?.[i] || '',
        data.accuracy?.manualMotility?.[i] || '',
        data.accuracy?.sqaMorph?.[i] || '',
        data.accuracy?.manualMorph?.[i] || ''
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [values], { origin: `A${48 + i}` });
    }

    // QC data
    for (let i = 0; i < 5; i++) {
      const values = [
        data.qc?.level1?.[i] || '',
        data.qc?.level2?.[i] || ''
      ];
      XLSX.utils.sheet_add_aoa(worksheet, [values], { origin: `B${71 + i}` });
    }

    console.log('Successfully wrote form data to worksheet');
  } catch (error) {
    console.error('Error writing data to worksheet:', error);
    throw new Error('Failed to write data to worksheet: ' + (error as Error).message);
  }
}