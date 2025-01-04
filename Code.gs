const TEMPLATE_SPREADSHEET_ID = '1mnPy-8Kzp_ffbU6H-0jpQH0CIf0F4wb0pplK-KQxDbk';
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
    // Create new spreadsheet from template
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const newFile = templateFile.makeCopy('SQA Data Collection Form - ' + new Date().toISOString());
    const ss = SpreadsheetApp.openById(newFile.getId());
    const sheet = ss.getSheets()[0];
    
    // Write data to spreadsheet
    writeFacilityInfo(sheet, data);
    writeLowerLimitDetection(sheet, data);
    writePrecisionData(sheet, data);
    writeAccuracyData(sheet, data);
    writeMorphGradeFinal(sheet, data);
    writeQCData(sheet, data);
    
    // Set formulas
    setFormulas(sheet);
    
    // Generate PDF
    const pdfBlob = ss.getAs('application/pdf');
    const pdfFile = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
    
    // Record submission in template sheet
    recordSubmission(data);
    
    // Send admin notification
    sendAdminNotification(data, ss.getUrl(), pdfFile.getUrl());
    
    return {
      status: 'success',
      message: 'Data submitted successfully'
    };
    
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    throw error;
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
  sheet.getRange('L48').setFormula('=COUNTIF(G48:J52,"TP")');
  sheet.getRange('L49').setFormula('=COUNTIF(G48:J52,"TN")');
  sheet.getRange('L50').setFormula('=COUNTIF(G48:J52,"FP")');
  sheet.getRange('L51').setFormula('=COUNTIF(G48:J52,"FN")');
  sheet.getRange('K54').setFormula('=L48/(L48+L51)');
  sheet.getRange('K56').setFormula('=L49/(L49+L50)');
}

function writeFacilityInfo(sheet, data) {
  sheet.getRange('B3:H3').setValue(data.facility);
  sheet.getRange('B4:H4').setValue(data.date);
  sheet.getRange('B5:H5').setValue(data.technician);
  sheet.getRange('B6:H6').setValue(data.serialNumber);
  console.log("Wrote facility info");
}

function writeLowerLimitDetection(sheet, data) {
  // Set header
  sheet.getRange('A8').setValue('LOWER LIMIT DETECTION');
  sheet.getRange('B10:B11').setValue('Conc. Value');
  sheet.getRange('C10:C11').setValue('MSC Value');
  
  // Write data
  for (let i = 0; i < data.lowerLimitDetection.conc.length; i++) {
    const row = 12 + i;
    // Only write to cells B12-B16 and C12-C16
    if (row <= 16) {
      sheet.getRange('B' + row).setValue(data.lowerLimitDetection.conc[i]);
      sheet.getRange('C' + row).setValue(data.lowerLimitDetection.msc[i]);
    }
  }
  console.log("Wrote Lower Limit Detection data");
}

function writePrecisionData(sheet, data) {
  // Level 1
  sheet.getRange('A20').setValue('PRECISION & SENSITIVITY - LEVEL 1');
  sheet.getRange('B22:B23').setValue('Conc. (M/mL)');
  sheet.getRange('C22:C23').setValue('Motility (%)');
  sheet.getRange('D22:D23').setValue('Morph. (%)');
  
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    const row = 24 + i;
    // Only write to cells B24-B28, C24-C28, D24-D28
    if (row <= 28) {
      sheet.getRange('B' + row).setValue(data.precisionLevel1.conc[i]);
      sheet.getRange('C' + row).setValue(data.precisionLevel1.motility[i]);
      sheet.getRange('D' + row).setValue(data.precisionLevel1.morph[i]);
    }
  }
  
  // Level 2
  sheet.getRange('A32').setValue('PRECISION & SENSITIVITY - LEVEL 2');
  sheet.getRange('B34:B35').setValue('Conc. (M/mL)');
  sheet.getRange('C34:C35').setValue('Motility (%)');
  sheet.getRange('D34:D35').setValue('Morph. (%)');
  
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    const row = 36 + i;
    // Only write to cells B36-B40, C36-C40, D36-D40
    if (row <= 40) {
      sheet.getRange('B' + row).setValue(data.precisionLevel2.conc[i]);
      sheet.getRange('C' + row).setValue(data.precisionLevel2.motility[i]);
      sheet.getRange('D' + row).setValue(data.precisionLevel2.morph[i]);
    }
  }
  console.log("Wrote Precision data");
}

function writeAccuracyData(sheet, data) {
  // Set header
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
  // Set header
  sheet.getRange('A67').setValue('PRECISION & SENSITIVITY - QC');
  
  for (let i = 0; i < data.qc.level1.length; i++) {
    const row = 86 + i;
    // Skip rows 93, 94, and 95
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

function recordSubmission(data) {
  const ss = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  
  // Test records to be added
  const testRecords = [
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['04/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['03/01/2025', 'Test Facility', 'test@example.com', '123-456-7890'],
    ['04/01/2025', 'Test Facility', 'test@example.com', '123-456-7890']
  ];
  
  // Get the last row
  const lastRow = sheet.getLastRow();
  
  // Add test records
  sheet.getRange(lastRow + 1, 1, testRecords.length, 4).setValues(testRecords);
  
  // Add the new submission after test records
  const newRow = lastRow + testRecords.length + 1;
  sheet.getRange(newRow, 1).setValue(new Date());
  sheet.getRange(newRow, 2).setValue(data.facility);
  sheet.getRange(newRow, 3).setValue(data.emailTo);
  sheet.getRange(newRow, 4).setValue(data.phone);
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
