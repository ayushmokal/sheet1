function writeAllData(sheet, data) {
  writeFacilityInfo(sheet, data);
  writeLowerLimitDetection(sheet, data);
  writePrecisionData(sheet, data);
  writeAccuracyData(sheet, data);
  writeMorphGradeFinal(sheet, data);
  writeQCData(sheet, data);
  setFormulas(sheet);
  createAccuracyGraphs(sheet, data);
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
  console.log("Wrote facility info");
}

function writeLowerLimitDetection(sheet, data) {
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
  // Level 1
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    const row = 24 + i;
    if (row <= 28) {
      sheet.getRange('B' + row).setValue(data.precisionLevel1.conc[i]);
      sheet.getRange('C' + row).setValue(data.precisionLevel1.motility[i]);
      sheet.getRange('D' + row).setValue(data.precisionLevel1.morph[i]);
    }
  }

  // Level 2
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    const row = 36 + i;
    if (row <= 40) {
      sheet.getRange('B' + row).setValue(data.precisionLevel2.conc[i]);
      sheet.getRange('C' + row).setValue(data.precisionLevel2.motility[i]);
      sheet.getRange('D' + row).setValue(data.precisionLevel2.morph[i]);
    }
  }
  console.log("Wrote Precision data");
}

function writeAccuracyData(sheet, data) {
  for (let i = 0; i < data.accuracy.sqa.length; i++) {
    const row = 48 + i;
    sheet.getRange('A' + row).setValue(data.accuracy.sqa[i]);
    sheet.getRange('B' + row).setValue(data.accuracy.manual[i]);
    sheet.getRange('C' + row).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange('D' + row).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange('E' + row).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange('F' + row).setValue(data.accuracy.manualMorph[i]);
  }
  console.log("Wrote Accuracy data");
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

function writeQCData(sheet, data) {
  for (let i = 0; i < data.qc.level1.length; i++) {
    const row = 86 + i;
    if (row !== 93 && row !== 94 && row !== 95) {
      sheet.getRange('B' + row).setValue(data.qc.level1[i]);
      sheet.getRange('C' + row).setValue(data.qc.level2[i]);
    }
  }
  console.log("Wrote QC data");
}