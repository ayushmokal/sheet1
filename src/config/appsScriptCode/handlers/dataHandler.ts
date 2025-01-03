export const dataHandlerScript = `
function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  if (!data) {
    throw new Error('No data provided');
  }

  const ss = SpreadsheetApp.openById(data.spreadsheetId);
  console.log("Opened spreadsheet");
  
  // Get template sheet
  const templateSheet = ss.getSheetByName('Template');
  if (!templateSheet) {
    throw new Error('Template sheet not found');
  }
  
  // Create new sheet from template
  const newSheetName = generateUniqueSheetName(ss, data);
  const newSheet = templateSheet.copyTo(ss);
  newSheet.setName(newSheetName);
  console.log("Created new sheet:", newSheetName);

  try {
    writeFacilityInfo(newSheet, data);
    writeLowerLimitDetection(newSheet, data);
    writePrecisionData(newSheet, data);
    writeAccuracyData(newSheet, data);
    writeMorphGradeFinal(newSheet, data);
    writeQCData(newSheet, data);
    setFormulas(newSheet);
    applySpreadsheetStyling(newSheet);
    createAccuracyGraphs(newSheet);

    return {
      status: 'success',
      message: 'Data submitted successfully',
      sheetName: newSheetName
    };
  } catch (error) {
    console.error("Error writing data:", error);
    try {
      ss.deleteSheet(newSheet);
    } catch (e) {
      console.error("Error deleting sheet after failure:", e);
    }
    throw error;
  }
}

function generateUniqueSheetName(ss, data) {
  const date = new Date(data.date);
  const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim();
  
  const baseSheetName = formattedDate + '_' + cleanSerialNumber + '_' + sanitizedFacility;
  let sheetName = baseSheetName;
  let counter = 1;
  
  while (ss.getSheetByName(sheetName)) {
    sheetName = baseSheetName + '_' + counter;
    counter++;
  }
  
  return sheetName;
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('B3').setValue(data.facility);
  sheet.getRange('B4').setValue(data.date);
  sheet.getRange('B5').setValue(data.technician);
  sheet.getRange('B6').setValue(data.serialNumber);
}

function writeLowerLimitDetection(sheet, data) {
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    sheet.getRange('B' + (12 + i)).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange('C' + (12 + i)).setValue(data.lowerLimitDetection.msc[i]);
  }
}

function writePrecisionData(sheet, data) {
  // Level 1
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    if (i < 2) continue; // Skip first two rows
    sheet.getRange('B' + (24 + i)).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange('C' + (24 + i)).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange('D' + (24 + i)).setValue(data.precisionLevel1.morph[i]);
  }

  // Level 2
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    if (i < 2) continue; // Skip first two rows
    sheet.getRange('B' + (36 + i)).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange('C' + (36 + i)).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange('D' + (36 + i)).setValue(data.precisionLevel2.morph[i]);
  }
}

function writeAccuracyData(sheet, data) {
  for (let i = 0; i < data.accuracy.sqa.length; i++) {
    sheet.getRange('A' + (48 + i)).setValue(data.accuracy.sqa[i]);
    sheet.getRange('B' + (48 + i)).setValue(data.accuracy.manual[i]);
    sheet.getRange('C' + (48 + i)).setValue(data.accuracy.sqaMotility[i]);
    sheet.getRange('D' + (48 + i)).setValue(data.accuracy.manualMotility[i]);
    sheet.getRange('E' + (48 + i)).setValue(data.accuracy.sqaMorph[i]);
    sheet.getRange('F' + (48 + i)).setValue(data.accuracy.manualMorph[i]);
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
    sheet.getRange('B' + (71 + i)).setValue(data.qc.level1[i]);
    sheet.getRange('C' + (71 + i)).setValue(data.qc.level2[i]);
  }
}

function setFormulas(sheet) {
  // Lower Limit Detection formulas
  sheet.getRange('B17').setFormula('=AVERAGE(B12:B16)');
  sheet.getRange('C17').setFormula('=AVERAGE(C12:C16)');
  sheet.getRange('B18').setFormula('=IF(B17>0,(STDEV(B12:B16)/B17*100),0)');
  sheet.getRange('C18').setFormula('=IF(C17>0,(STDEV(C12:C16)/C17*100),0)');
  
  // Precision Level 1 formulas
  sheet.getRange('B29').setFormula('=AVERAGE(B24:B28)');
  sheet.getRange('C29').setFormula('=AVERAGE(C24:C28)');
  sheet.getRange('D29').setFormula('=AVERAGE(D24:D28)');
  sheet.getRange('B30').setFormula('=IF(B29>0,(STDEV(B24:B28)/B29*100),0)');
  sheet.getRange('C30').setFormula('=IF(C29>0,(STDEV(C24:C28)/C29*100),0)');
  sheet.getRange('D30').setFormula('=IF(D29>0,(STDEV(D24:D28)/D29*100),0)');
  
  // Precision Level 2 formulas
  sheet.getRange('B41').setFormula('=AVERAGE(B36:B40)');
  sheet.getRange('C41').setFormula('=AVERAGE(C36:C40)');
  sheet.getRange('D41').setFormula('=AVERAGE(D36:D40)');
  sheet.getRange('B42').setFormula('=IF(B41>0,(STDEV(B36:B40)/B41*100),0)');
  sheet.getRange('C42').setFormula('=IF(C41>0,(STDEV(C36:C40)/C41*100),0)');
  sheet.getRange('D42').setFormula('=IF(D41>0,(STDEV(D36:D40)/D41*100),0)');
  
  // Accuracy formulas
  sheet.getRange('K54').setFormula('=L48/(L48+L51)*100');
  sheet.getRange('K56').setFormula('=L49/(L49+L50)*100');
}

function applySpreadsheetStyling(sheet) {
  // Set title
  const title = sheet.getRange('A1');
  title.setValue('SQA Precision / Accuracy / Lower Limit Detection Study - 5 Replicates');
  title.setFontSize(14);
  title.setFontWeight('bold');
  
  // Format header section
  const headerRange = sheet.getRange('A3:H6');
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Format tables
  const tables = [
    'A10:C18',  // Lower Limit Detection
    'A22:D30',  // Precision Level 1
    'A34:D42',  // Precision Level 2
    'A46:F52',  // Accuracy
    'A69:C74'   // QC
  ];
  
  tables.forEach(range => {
    const table = sheet.getRange(range);
    table.setBorder(true, true, true, true, true, true);
    table.setHorizontalAlignment('center');
  });
  
  // Set pass/fail box styling
  const passBoxes = [
    { range: 'F12:H16', text: 'ANALYTICAL SENSITIVITY' },
    { range: 'F24:H28', text: 'SQA PRECISION' },
    { range: 'F36:H40', text: 'SQA PRECISION' }
  ];
  
  passBoxes.forEach(box => {
    const range = sheet.getRange(box.range);
    range.setBackground('#ADD8E6');
    range.setBorder(true, true, true, true, true, true);
    range.merge();
    range.setValue(box.text);
    range.setHorizontalAlignment('center');
    range.setVerticalAlignment('middle');
  });
  
  // Set section headers
  const headers = [
    { range: 'A8', text: 'LOWER LIMIT DETECTION' },
    { range: 'A20', text: 'PRECISION & SENSITIVITY - LEVEL 1' },
    { range: 'A32', text: 'PRECISION & SENSITIVITY - LEVEL 2' },
    { range: 'A44', text: 'ACCURACY (OPTIONAL)' },
    { range: 'A67', text: 'PRECISION & SENSITIVITY - QC' }
  ];
  
  headers.forEach(header => {
    const range = sheet.getRange(header.range);
    range.setValue(header.text);
    range.setFontWeight('bold');
    range.setBackground('#F0F0F0');
  });
  
  // Add descriptions
  sheet.getRange('A9').setValue('Materials: QwikCheck beads (Negative Control) - Pass Criteria: Conc. = 0.0, MSC = 0.0');
  sheet.getRange('A21').setValue('Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%');
  sheet.getRange('A33').setValue('Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%');
  sheet.getRange('A45').setValue('Materials: Live Human Semen - Manual vs. SQA Comparison');
  sheet.getRange('A68').setValue('Materials: QwikCheck QC Beads - Pass Criteria: Conc. < 10%');
}

function createAccuracyGraphs(sheet) {
  // Create concentration scatter plot
  const concentrationChart = sheet.newChart()
    .setChartType(Charts.ChartType.SCATTER)
    .addRange(sheet.getRange('A48:B52'))
    .setPosition(5, 8, 0, 0)
    .setOption('title', 'SQA Accuracy: Sperm Concentration')
    .setOption('hAxis.title', 'Manual Sperm Conc., M/ml')
    .setOption('vAxis.title', 'SQA Sperm Conc., M/ml')
    .setOption('legend', 'none')
    .setOption('trendlines', [{
      type: 'linear',
      showR2: true,
      visibleInLegend: true
    }])
    .build();
  
  // Create motility scatter plot
  const motilityChart = sheet.newChart()
    .setChartType(Charts.ChartType.SCATTER)
    .addRange(sheet.getRange('C48:D52'))
    .setPosition(25, 8, 0, 0)
    .setOption('title', 'SQA Accuracy: Motility')
    .setOption('hAxis.title', 'Manual Motility, %')
    .setOption('vAxis.title', 'SQA Motility, %')
    .setOption('legend', 'none')
    .setOption('trendlines', [{
      type: 'linear',
      showR2: true,
      visibleInLegend: true
    }])
    .build();

  sheet.insertChart(concentrationChart);
  sheet.insertChart(motilityChart);
  
  // Add R² value labels
  sheet.getRange('I54').setValue('R² = ');
  sheet.getRange('I55').setValue('R² = ');
}
`;