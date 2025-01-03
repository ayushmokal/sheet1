function writeAllData(sheet, data) {
  writeFacilityInfo(sheet, data);
  writeLowerLimitDetection(sheet, data);
  writePrecisionData(sheet, data);
  writeAccuracyData(sheet, data);
  writeMorphGradeFinal(sheet, data);
  writeQCData(sheet, data);
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
}

function writeLowerLimitDetection(sheet, data) {
  sheet.getRange('A8').setValue('LOWER LIMIT DETECTION');
  sheet.getRange('A10').setValue('Sample #');
  sheet.getRange('B10:B11').setValue('Conc. Value');
  sheet.getRange('C10:C11').setValue('MSC Value');
  
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange(`A${12 + i}`).setValue(i + 1);
    sheet.getRange(`B${12 + i}`).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange(`C${12 + i}`).setValue(data.lowerLimitDetection.msc[i]);
  }
}

function writePrecisionData(sheet, data) {
  // Level 1
  sheet.getRange('A20').setValue('PRECISION & SENSITIVITY - LEVEL 1');
  sheet.getRange('A22').setValue('Sample #');
  sheet.getRange('B22:B23').setValue('Conc. (M/mL)');
  sheet.getRange('C22:C23').setValue('Motility (%)');
  sheet.getRange('D22:D23').setValue('Morph. (%)');
  
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange(`A${24 + i}`).setValue(i + 1);
    sheet.getRange(`B${24 + i}`).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange(`C${24 + i}`).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange(`D${24 + i}`).setValue(data.precisionLevel1.morph[i]);
  }

  // Level 2
  sheet.getRange('A32').setValue('PRECISION & SENSITIVITY - LEVEL 2');
  sheet.getRange('A34').setValue('Sample #');
  sheet.getRange('B34:B35').setValue('Conc. (M/mL)');
  sheet.getRange('C34:C35').setValue('Motility (%)');
  sheet.getRange('D34:D35').setValue('Morph. (%)');
  
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange(`A${36 + i}`).setValue(i + 1);
    sheet.getRange(`B${36 + i}`).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange(`C${36 + i}`).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange(`D${36 + i}`).setValue(data.precisionLevel2.morph[i]);
  }
}

function writeAccuracyData(sheet, data) {
  sheet.getRange('A44').setValue('ACCURACY (OPTIONAL)');
  sheet.getRange('A46:B46').setValue('CONC., M/ml');
  sheet.getRange('C46:D46').setValue('MOTILITY, %');
  sheet.getRange('E46:F46').setValue('MORPHOLOGY, %');
  
  sheet.getRange('A47').setValue('SQA');
  sheet.getRange('B47').setValue('Manual');
  sheet.getRange('C47').setValue('SQA');
  sheet.getRange('D47').setValue('Manual');
  sheet.getRange('E47').setValue('SQA');
  sheet.getRange('F47').setValue('Manual');
  
  for (let i = 0; i < data.accuracy.sqa.length; i++) {
    sheet.getRange(`A${48 + i}`).setValue(data.accuracy.sqa[i]);
    sheet.getRange(`B${48 + i}`).setValue(data.accuracy.manual[i]);
    sheet.getRange(`C${48 + i}`).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange(`D${48 + i}`).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange(`E${48 + i}`).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange(`F${48 + i}`).setValue(data.accuracy.manualMorph[i]);
  }
}

function writeMorphGradeFinal(sheet, data) {
  const tp = parseFloat(data.accuracy.morphGradeFinal.tp) || 0;
  const tn = parseFloat(data.accuracy.morphGradeFinal.tn) || 0;
  const fp = parseFloat(data.accuracy.morphGradeFinal.fp) || 0;
  const fn = parseFloat(data.accuracy.morphGradeFinal.fn) || 0;

  sheet.getRange('L48').setValue(tp);
  sheet.getRange('L49').setValue(tn);
  sheet.getRange('L50').setValue(fp);
  sheet.getRange('L51').setValue(fn);
}

function writeQCData(sheet, data) {
  sheet.getRange('A67').setValue('PRECISION & SENSITIVITY - QC');
  sheet.getRange('A69').setValue('Sample #');
  sheet.getRange('B69').setValue('Level 1 Conc. (M/mL)');
  sheet.getRange('C69').setValue('Level 2 Conc. (M/mL)');
  
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange(`A${71 + i}`).setValue(i + 1);
    sheet.getRange(`B${71 + i}`).setValue(data.qc.level1[i]);
    sheet.getRange(`C${71 + i}`).setValue(data.qc.level2[i]);
  }
}