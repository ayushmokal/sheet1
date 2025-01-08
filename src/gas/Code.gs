const TEMPLATE_SPREADSHEET_ID = '1NN-_CgDUpIrzW_Rlsa5FHPnGqE9hIwC4jEjaBVG3tWU';
const ADMIN_EMAIL = 'ayushmokal13@gmail.com';
const PDF_FOLDER_ID = '1Z9dygHEDb-ZOSzAVqxIFTu7iJ7ADgWdD';
const EMAIL_LOG_SPREADSHEET_ID = '1mnPy-8Kzp_ffbU6H-0jpQH0CIf0F4wb0pplK-KQxDbk';

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
    
    writeAllData(sheet, data);
    createAccuracyGraphs(sheet, data);
    setFormulas(sheet);
    
    const pdfBlob = ss.getAs('application/pdf');
    const pdfFile = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
    
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

function writeAllData(sheet, data) {
  writeFacilityInfo(sheet, data);
  writeLowerLimitDetection(sheet, data);
  writePrecisionData(sheet, data);
  writeAccuracyData(sheet, data);
  writeMorphGradeFinal(sheet, data);
  writeQCData(sheet, data);
  console.log("Completed writing all data");
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
    sheet.getRange('B' + (12 + i)).setValue(data.lowerLimitDetection.conc[i]);
    sheet.getRange('C' + (12 + i)).setValue(data.lowerLimitDetection.msc[i]);
  }
  console.log("Wrote Lower Limit Detection data");
}

function writePrecisionData(sheet, data) {
  // Level 1
  for (let i = 0; i < data.precisionLevel1.conc.length; i++) {
    sheet.getRange('B' + (24 + i)).setValue(data.precisionLevel1.conc[i]);
    sheet.getRange('C' + (24 + i)).setValue(data.precisionLevel1.motility[i]);
    sheet.getRange('D' + (24 + i)).setValue(data.precisionLevel1.morph[i]);
  }
  console.log("Wrote Precision Level 1 data");

  // Level 2
  for (let i = 0; i < data.precisionLevel2.conc.length; i++) {
    sheet.getRange('B' + (36 + i)).setValue(data.precisionLevel2.conc[i]);
    sheet.getRange('C' + (36 + i)).setValue(data.precisionLevel2.motility[i]);
    sheet.getRange('D' + (36 + i)).setValue(data.precisionLevel2.morph[i]);
  }
  console.log("Wrote Precision Level 2 data");
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
    sheet.getRange('B' + (71 + i)).setValue(data.qc.level1[i]);
    sheet.getRange('C' + (71 + i)).setValue(data.qc.level2[i]);
  }
  console.log("Wrote QC data");
}

function createAccuracyGraphs(sheet, data) {
  // Create arrays for correlation calculation
  const concData = [];
  const motilityData = [];
  
  // Collect data points for calculations
  for (let i = 0; i < 5; i++) {
    const row = 48 + i;
    const sqaConc = parseFloat(sheet.getRange(`A${row}`).getValue()) || 0;
    const manualConc = parseFloat(sheet.getRange(`B${row}`).getValue()) || 0;
    const sqaMotility = parseFloat(sheet.getRange(`C${row}`).getValue()) || 0;
    const manualMotility = parseFloat(sheet.getRange(`D${row}`).getValue()) || 0;
    
    if (!isNaN(sqaConc) && !isNaN(manualConc)) {
      concData.push([manualConc, sqaConc]);
    }
    if (!isNaN(sqaMotility) && !isNaN(manualMotility)) {
      motilityData.push([manualMotility, sqaMotility]);
    }
  }
  
  // Calculate R² values
  const concR2 = calculateRSquared(concData);
  const motilityR2 = calculateRSquared(motilityData);
  
  // Write R² values to specified cells
  sheet.getRange('F85').setValue(concR2);
  sheet.getRange('F91').setValue(motilityR2);
  
  console.log("Created accuracy graphs with R² values:", { concR2, motilityR2 });
}

function calculateRSquared(data) {
  if (data.length < 2) return 0;
  
  // Calculate means
  let sumX = 0, sumY = 0;
  for (const [x, y] of data) {
    sumX += x;
    sumY += y;
  }
  const meanX = sumX / data.length;
  const meanY = sumY / data.length;
  
  // Calculate R²
  let ssRes = 0, ssTot = 0;
  let sumXY = 0, sumXX = 0;
  
  for (const [x, y] of data) {
    sumXY += (x - meanX) * (y - meanY);
    sumXX += (x - meanX) * (x - meanX);
    ssTot += (y - meanY) * (y - meanY);
  }
  
  const slope = sumXY / sumXX;
  const intercept = meanY - slope * meanX;
  
  for (const [x, y] of data) {
    const yPred = slope * x + intercept;
    ssRes += (y - yPred) * (y - yPred);
  }
  
  const rSquared = 1 - (ssRes / ssTot);
  return Math.round(rSquared * 1000) / 1000; // Round to 3 decimal places
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
  
  console.log("Set all formulas");
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = `New SQA Data Submission from ${data.facility}`;
  const body = `
    New SQA data has been submitted:
    
    Facility: ${data.facility}
    Date: ${data.date}
    Technician: ${data.technician}
    Serial Number: ${data.serialNumber}
    
    View the spreadsheet: ${spreadsheetUrl}
    Download PDF: ${pdfUrl}
  `;
  
  MailApp.sendEmail(ADMIN_EMAIL, subject, body);
  console.log("Sent admin notification email");
}