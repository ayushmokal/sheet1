import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

export function writeFormDataToWorksheet(worksheet: XLSX.WorkSheet, data: any) {
  try {
    console.log('Writing form data to worksheet while preserving formatting...');
    
    // Facility info (B3:B6)
    const facilityInfo = [
      [data.facility || ''],
      [data.date || ''],
      [data.technician || ''],
      [data.serialNumber || '']
    ];
    
    // Preserve existing cell styles and only update values
    for (let i = 0; i < facilityInfo.length; i++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: 2 + i, c: 1 })];
      if (cell) {
        cell.v = facilityInfo[i][0]; // Update value
        cell.w = facilityInfo[i][0].toString(); // Update displayed text
      }
    }

    // Lower Limit Detection (B12:C16)
    for (let i = 0; i < 5; i++) {
      const concCell = worksheet[XLSX.utils.encode_cell({ r: 11 + i, c: 1 })];
      const mscCell = worksheet[XLSX.utils.encode_cell({ r: 11 + i, c: 2 })];
      
      if (concCell) {
        concCell.v = data.lowerLimitDetection?.conc?.[i] || '1';
        concCell.w = (data.lowerLimitDetection?.conc?.[i] || '1').toString();
      }
      if (mscCell) {
        mscCell.v = data.lowerLimitDetection?.msc?.[i] || '1';
        mscCell.w = (data.lowerLimitDetection?.msc?.[i] || '1').toString();
      }
    }

    // Precision Level 1 (B24:D28)
    for (let i = 0; i < 5; i++) {
      const concCell = worksheet[XLSX.utils.encode_cell({ r: 23 + i, c: 1 })];
      const motilityCell = worksheet[XLSX.utils.encode_cell({ r: 23 + i, c: 2 })];
      const morphCell = worksheet[XLSX.utils.encode_cell({ r: 23 + i, c: 3 })];
      
      if (concCell) {
        concCell.v = data.precisionLevel1?.conc?.[i] || '1';
        concCell.w = (data.precisionLevel1?.conc?.[i] || '1').toString();
      }
      if (motilityCell) {
        motilityCell.v = data.precisionLevel1?.motility?.[i] || '1';
        motilityCell.w = (data.precisionLevel1?.motility?.[i] || '1').toString();
      }
      if (morphCell) {
        morphCell.v = data.precisionLevel1?.morph?.[i] || '1';
        morphCell.w = (data.precisionLevel1?.morph?.[i] || '1').toString();
      }
    }

    // Precision Level 2 (B36:D40)
    for (let i = 0; i < 5; i++) {
      const concCell = worksheet[XLSX.utils.encode_cell({ r: 35 + i, c: 1 })];
      const motilityCell = worksheet[XLSX.utils.encode_cell({ r: 35 + i, c: 2 })];
      const morphCell = worksheet[XLSX.utils.encode_cell({ r: 35 + i, c: 3 })];
      
      if (concCell) {
        concCell.v = data.precisionLevel2?.conc?.[i] || '1';
        concCell.w = (data.precisionLevel2?.conc?.[i] || '1').toString();
      }
      if (motilityCell) {
        motilityCell.v = data.precisionLevel2?.motility?.[i] || '1';
        motilityCell.w = (data.precisionLevel2?.motility?.[i] || '1').toString();
      }
      if (morphCell) {
        morphCell.v = data.precisionLevel2?.morph?.[i] || '1';
        morphCell.w = (data.precisionLevel2?.morph?.[i] || '1').toString();
      }
    }

    // Accuracy data (A48:F52)
    for (let i = 0; i < 5; i++) {
      const sqaCell = worksheet[XLSX.utils.encode_cell({ r: 47 + i, c: 0 })];
      const manualCell = worksheet[XLSX.utils.encode_cell({ r: 47 + i, c: 1 })];
      const sqaMotilityCell = worksheet[XLSX.utils.encode_cell({ r: 47 + i, c: 2 })];
      const manualMotilityCell = worksheet[XLSX.utils.encode_cell({ r: 47 + i, c: 3 })];
      const sqaMorphCell = worksheet[XLSX.utils.encode_cell({ r: 47 + i, c: 4 })];
      const manualMorphCell = worksheet[XLSX.utils.encode_cell({ r: 47 + i, c: 5 })];
      
      if (sqaCell) {
        sqaCell.v = data.accuracy?.sqa?.[i] || '1';
        sqaCell.w = (data.accuracy?.sqa?.[i] || '1').toString();
      }
      if (manualCell) {
        manualCell.v = data.accuracy?.manual?.[i] || '1';
        manualCell.w = (data.accuracy?.manual?.[i] || '1').toString();
      }
      if (sqaMotilityCell) {
        sqaMotilityCell.v = data.accuracy?.sqaMotility?.[i] || '1';
        sqaMotilityCell.w = (data.accuracy?.sqaMotility?.[i] || '1').toString();
      }
      if (manualMotilityCell) {
        manualMotilityCell.v = data.accuracy?.manualMotility?.[i] || '1';
        manualMotilityCell.w = (data.accuracy?.manualMotility?.[i] || '1').toString();
      }
      if (sqaMorphCell) {
        sqaMorphCell.v = data.accuracy?.sqaMorph?.[i] || '1';
        sqaMorphCell.w = (data.accuracy?.sqaMorph?.[i] || '1').toString();
      }
      if (manualMorphCell) {
        manualMorphCell.v = data.accuracy?.manualMorph?.[i] || '1';
        manualMorphCell.w = (data.accuracy?.manualMorph?.[i] || '1').toString();
      }
    }

    // QC data (B71:C75)
    for (let i = 0; i < 5; i++) {
      const level1Cell = worksheet[XLSX.utils.encode_cell({ r: 70 + i, c: 1 })];
      const level2Cell = worksheet[XLSX.utils.encode_cell({ r: 70 + i, c: 2 })];
      
      if (level1Cell) {
        level1Cell.v = data.qc?.level1?.[i] || '1';
        level1Cell.w = (data.qc?.level1?.[i] || '1').toString();
      }
      if (level2Cell) {
        level2Cell.v = data.qc?.level2?.[i] || '1';
        level2Cell.w = (data.qc?.level2?.[i] || '1').toString();
      }
    }

    console.log('Successfully wrote form data to worksheet while preserving formatting');
  } catch (error) {
    console.error('Error writing data to worksheet:', error);
    throw new Error('Failed to write data to worksheet: ' + (error as Error).message);
  }
}