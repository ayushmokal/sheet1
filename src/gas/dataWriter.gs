function writeAllData(sheet, data) {
  writeFacilityInfo(sheet, data);
  writeLowerLimitDetection(sheet, data);
  writePrecisionData(sheet, data);
  writeAccuracyData(sheet, data);
  writeMorphGradeFinal(sheet, data);
  writeQCData(sheet, data);
  setFormulas(sheet);
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
}

function writeLowerLimitDetection(sheet, data) {
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange(`B${12 + i}`).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange(`C${12 + i}`).setValue(data.lowerLimitDetection.msc[i]);
  }
}

function writePrecisionData(sheet, data) {
  // Level 1
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange(`B${24 + i}`).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange(`C${24 + i}`).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange(`D${24 + i}`).setValue(data.precisionLevel1.morph[i]);
  }

  // Level 2
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange(`B${36 + i}`).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange(`C${36 + i}`).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange(`D${36 + i}`).setValue(data.precisionLevel2.morph[i]);
  }
}

function writeAccuracyData(sheet, data) {
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
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange(`B${71 + i}`).setValue(data.qc.level1[i]);
    sheet.getRange(`C${71 + i}`).setValue(data.qc.level2[i]);
  }
}