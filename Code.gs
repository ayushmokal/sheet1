const TEMPLATE_SPREADSHEET_ID = '1NN-_CgDUpIrzW_Rlsa5FHPnGqE9hIwC4jEjaBVG3tWU';
const ADMIN_EMAIL = 'ayushmokal13@gmail.com';
const PDF_FOLDER_ID = '1Z9dygHEDb-ZOSzAVqxIFTu7iJ7ADgWdD';

function doGet(e) {
  const params = e.parameter;
  const callback = params.callback;
  const action = params.action;
  const data = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;
  
  let result;
  
  try {
    if (action === 'submit') {
      if (!data) {
        throw new Error('No data provided');
      }
      result = handleSubmit(data);
    } else {
      throw new Error('Invalid action');
    }
    
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    const errorResponse = {
      status: 'error',
      message: error.message
    };
    
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(errorResponse) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const newFile = templateFile.makeCopy('SQA Data Collection Form - ' + new Date().toISOString());
    const ss = SpreadsheetApp.openById(newFile.getId());
    const sheet = ss.getSheets()[0];
    
    writeFacilityInfo(sheet, data);
    writeLowerLimitDetection(sheet, data);
    writePrecisionData(sheet, data);
    writeAccuracyData(sheet, data);
    writeMorphGradeFinal(sheet, data);
    writeQCData(sheet, data);
    setFormulas(sheet);
    applySpreadsheetStyling(sheet);
    createAccuracyGraphs(sheet);
    
    const pdfBlob = ss.getAs('application/pdf');
    const pdfFile = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
    
    recordSubmission(data);
    sendAdminNotification(data, ss.getUrl(), pdfFile.getUrl());
    
    return {
      status: 'success',
      message: 'Data submitted successfully',
      spreadsheetUrl: ss.getUrl(),
      pdfUrl: pdfFile.getUrl()
    };
    
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    throw error;
  }
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('A1').setValue('SQA Precision / Accuracy / Lower Limit Detection Study - 5 Replicates');
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
}

function writeLowerLimitDetection(sheet, data) {
  sheet.getRange('A8').setValue('LOWER LIMIT DETECTION');
  sheet.getRange('A9').setValue('Materials: QwikCheck beads (Negative Control) - Pass Criteria: Conc. = 0.0, MSC = 0.0');
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
  sheet.getRange('A21').setValue('Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%');
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
  sheet.getRange('A33').setValue('Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%');
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
  sheet.getRange('A45').setValue('Materials: Live Human Semen - Manual vs. SQA Comparison');
  sheet.getRange('A46:B46').setValue('CONC., M/ml');
  sheet.getRange('C46:D46').setValue('MOTILITY, %');
  sheet.getRange('E46:F46').setValue('MORPHOLOGY, %');
  sheet.getRange('G46').setValue('Morph. Grade');
  
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
  sheet.getRange('K46').setValue('Morph. Grade Final');
  sheet.getRange('K47').setValue('TP');
  sheet.getRange('K48').setValue('TN');
  sheet.getRange('K49').setValue('FP');
  sheet.getRange('K50').setValue('FN');
  
  sheet.getRange('L46').setValue(data.accuracy.morphGradeFinal.tp);
  sheet.getRange('L47').setValue(data.accuracy.morphGradeFinal.tn);
  sheet.getRange('L48').setValue(data.accuracy.morphGradeFinal.fp);
  sheet.getRange('L49').setValue(data.accuracy.morphGradeFinal.fn);
  
  sheet.getRange('K53').setValue('Sensitivity = TP / (TP + FN) * 100');
  sheet.getRange('K55').setValue('Specificity = TN / (FP + TN) * 100');
}

function writeQCData(sheet, data) {
  sheet.getRange('A67').setValue('PRECISION & SENSITIVITY - QC');
  sheet.getRange('A68').setValue('Materials: QwikCheck QC Beads - Pass Criteria: Conc. < 10%');
  sheet.getRange('A69').setValue('Sample #');
  sheet.getRange('B69').setValue('Level 1 Conc. (M/mL)');
  sheet.getRange('C69').setValue('Level 2 Conc. (M/mL)');
  
  for (let i = 0; i < data.qc.level1.length; i++) {
    sheet.getRange(`A${71 + i}`).setValue(i + 1);
    sheet.getRange(`B${71 + i}`).setValue(data.qc.level1[i]);
    sheet.getRange(`C${71 + i}`).setValue(data.qc.level2[i]);
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
  sheet.getRange('K54').setFormula('=L46/(L46+L49)*100');
  sheet.getRange('K56').setFormula('=L47/(L47+L48)*100');
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
}

function applySpreadsheetStyling(sheet) {
  // Set title styling
  const titleRange = sheet.getRange('A1');
  titleRange.setFontSize(14);
  titleRange.setFontWeight('bold');
  titleRange.setBackground('#F0F0F0');
  
  // Format header section
  const headerRange = sheet.getRange('A3:H6');
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Format tables
  const tables = [
    'A10:C18',  // Lower Limit Detection
    'A22:D30',  // Precision Level 1
    'A34:D42',  // Precision Level 2
    'A46:G52',  // Accuracy
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
  
  // Add accuracy outcome section
  sheet.getRange('A58:K58').merge();
  sheet.getRange('A58').setValue('SQA ACCURACY OUTCOME');
  sheet.getRange('A58').setHorizontalAlignment('center');
  sheet.getRange('A58').setBackground('#F0F0F0');
  sheet.getRange('A58').setFontWeight('bold');
  
  // Add accuracy criteria section
  const criteriaRange = sheet.getRange('A76:B78');
  criteriaRange.setBorder(true, true, true, true, true, true);
  sheet.getRange('A76').setValue('Accuracy - Recommended Pass Critieria');
  sheet.getRange('A77').setValue('Concentration:');
  sheet.getRange('B77').setValue('Hit within 15% of the manufacturer\'s clinical claims = Correlation: >0.765, Sensitivity: >76.5%, Specificity: >72.3%');
  sheet.getRange('A78').setValue('Motility:');
  sheet.getRange('B78').setValue('Hit within 15% of manufacturer\'s clinical claims = Correlation: >0.680, Sensitivity: >72.3%, Specificity: >68.0%');
  sheet.getRange('A79').setValue('Morphology:');
  sheet.getRange('B79').setValue('Hit within 15% of manufacturer\'s clinical claims = Sensitivity: >68.0%, Specificity: >76.5%');
}

function recordSubmission(data) {
  const ss = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  const lastRow = sheet.getLastRow();
  
  sheet.getRange(lastRow + 1, 1).setValue(new Date());
  sheet.getRange(lastRow + 1, 2).setValue(data.facility);
  sheet.getRange(lastRow + 1, 3).setValue(data.emailTo);
  sheet.getRange(lastRow + 1, 4).setValue(data.phone);
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = 'New SQA Data Submission - ' + data.facility;
  const body = `New SQA data submission received:
    
Facility: ${data.facility}
Date: ${data.date}
Technician: ${data.technician}
Serial Number: ${data.serialNumber}
Client Email: ${data.emailTo}
Client Phone: ${data.phone}

Spreadsheet: ${spreadsheetUrl}
PDF: ${pdfUrl}`;

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
}