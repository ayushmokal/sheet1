function writeAllData(sheet, data) {
  // Write facility info (B3:B6)
  const facilityInfoValues = [
    [data.facility],
    [data.date],
    [data.technician],
    [data.serialNumber]
  ];
  sheet.getRange('B3:B6').setValues(facilityInfoValues);
  
  // Write Lower Limit Detection data (B12:C16)
  const lldRange = sheet.getRange('B12:C16');
  for (let i = 0; i < 5; i++) {
    const row = lldRange.getCell(i + 1, 1);
    const concValue = data.lowerLimitDetection.conc[i] || '1';
    row.setValue(concValue);
    
    const mscCell = lldRange.getCell(i + 1, 2);
    const mscValue = data.lowerLimitDetection.msc[i] || '1';
    mscCell.setValue(mscValue);
  }
  
  // Write Precision Level 1 data (B24:D28)
  const precisionL1Range = sheet.getRange('B24:D28');
  for (let i = 0; i < 5; i++) {
    const concValue = data.precisionLevel1.conc[i] || '1';
    const motilityValue = data.precisionLevel1.motility[i] || '1';
    const morphValue = data.precisionLevel1.morph[i] || '1';
    
    precisionL1Range.getCell(i + 1, 1).setValue(concValue);
    precisionL1Range.getCell(i + 1, 2).setValue(motilityValue);
    precisionL1Range.getCell(i + 1, 3).setValue(morphValue);
  }
  
  // Write Precision Level 2 data (B36:D40)
  const precisionL2Range = sheet.getRange('B36:D40');
  for (let i = 0; i < 5; i++) {
    const concValue = data.precisionLevel2.conc[i] || '1';
    const motilityValue = data.precisionLevel2.motility[i] || '1';
    const morphValue = data.precisionLevel2.morph[i] || '1';
    
    precisionL2Range.getCell(i + 1, 1).setValue(concValue);
    precisionL2Range.getCell(i + 1, 2).setValue(motilityValue);
    precisionL2Range.getCell(i + 1, 3).setValue(morphValue);
  }
  
  // Write Accuracy data (A48:F52)
  const accuracyRange = sheet.getRange('A48:F52');
  for (let i = 0; i < 5; i++) {
    const sqaValue = data.accuracy.sqa[i] || '1';
    const manualValue = data.accuracy.manual[i] || '1';
    const sqaMotilityValue = data.accuracy.sqaMotility[i] || '1';
    const manualMotilityValue = data.accuracy.manualMotility[i] || '1';
    const sqaMorphValue = data.accuracy.sqaMorph[i] || '1';
    const manualMorphValue = data.accuracy.manualMorph[i] || '1';
    
    accuracyRange.getCell(i + 1, 1).setValue(sqaValue);
    accuracyRange.getCell(i + 1, 2).setValue(manualValue);
    accuracyRange.getCell(i + 1, 3).setValue(sqaMotilityValue);
    accuracyRange.getCell(i + 1, 4).setValue(manualMotilityValue);
    accuracyRange.getCell(i + 1, 5).setValue(sqaMorphValue);
    accuracyRange.getCell(i + 1, 6).setValue(manualMorphValue);
  }
  
  // Write QC data (B71:C75)
  const qcRange = sheet.getRange('B71:C75');
  for (let i = 0; i < 5; i++) {
    const level1Value = data.qc.level1[i] || '1';
    const level2Value = data.qc.level2[i] || '1';
    
    qcRange.getCell(i + 1, 1).setValue(level1Value);
    qcRange.getCell(i + 1, 2).setValue(level2Value);
  }
  
  // Set formulas and create graphs after writing data
  setFormulas(sheet);
  createAccuracyGraphs(sheet);
  
  console.log("Completed writing all data to sheet");
}