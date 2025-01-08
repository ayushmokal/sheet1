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
  console.log("Wrote facility info");
}

function writeLowerLimitDetection(sheet, data) {
  sheet.getRange('A8').setValue('LOWER LIMIT DETECTION');
  sheet.getRange('B10:B11').setValue('Conc. Value');
  sheet.getRange('C10:C11').setValue('MSC Value');
  
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    const row = 12 + i;
    if (row <= 16) {
      sheet.getRange('B' + row).setValue(data.lowerLimitDetection.conc[i]);
      sheet.getRange('C' + row).setValue(data.lowerLimitDetection.msc[i]);
    }
  }
  console.log("Wrote Lower Limit Detection data");
}

function writePrecisionData(sheet, data) {
  writePrecisionLevel(sheet, data.precisionLevel1, 'PRECISION & SENSITIVITY - LEVEL 1', 20, 24);
  writePrecisionLevel(sheet, data.precisionLevel2, 'PRECISION & SENSITIVITY - LEVEL 2', 32, 36);
  console.log("Wrote Precision data");
}

function writePrecisionLevel(sheet, levelData, title, titleRow, startRow) {
  sheet.getRange('A' + titleRow).setValue(title);
  sheet.getRange(`B${titleRow+2}:B${titleRow+3}`).setValue('Conc. (M/mL)');
  sheet.getRange(`C${titleRow+2}:C${titleRow+3}`).setValue('Motility (%)');
  sheet.getRange(`D${titleRow+2}:D${titleRow+3}`).setValue('Morph. (%)');
  
  for (let i = 0; i < levelData.conc.length; i++) {
    const row = startRow + i;
    if (row <= startRow + 4) {
      sheet.getRange('B' + row).setValue(levelData.conc[i]);
      sheet.getRange('C' + row).setValue(levelData.motility[i]);
      sheet.getRange('D' + row).setValue(levelData.morph[i]);
    }
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
    const row = 48 + i;
    sheet.getRange(`A${row}`).setValue(data.accuracy.sqa[i]);
    sheet.getRange(`B${row}`).setValue(data.accuracy.manual[i]);
    sheet.getRange(`C${row}`).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange(`D${row}`).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange(`E${row}`).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange(`F${row}`).setValue(data.accuracy.manualMorph[i]);
  }
  console.log("Wrote Accuracy data");
}

function writeQCData(sheet, data) {
  sheet.getRange('A67').setValue('PRECISION & SENSITIVITY - QC');
  
  for (let i = 0; i < data.qc.level1.length; i++) {
    const row = 86 + i;
    if (row !== 93 && row !== 94 && row !== 95) {
      sheet.getRange('B' + row).setValue(data.qc.level1[i]);
      sheet.getRange('C' + row).setValue(data.qc.level2[i]);
    }
  }
  console.log("Wrote QC data");
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

  const sensitivity = tp + fn !== 0 ? (tp / (tp + fn)) * 100 : 0;
  const specificity = fp + tn !== 0 ? (tn / (fp + tn)) * 100 : 0;

  sheet.getRange('L46').setValue(sensitivity);
  sheet.getRange('L47').setValue(specificity);
  console.log("Wrote Morph Grade Final data");
}