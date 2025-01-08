function doGet(e) {
  const params = e.parameter;
  const callback = params.callback;
  const action = params.action;
  const data = params.data ? JSON.parse(decodeURIComponent(params.data)) : null;
  
  let result;
  
  try {
    switch (action) {
      case 'createCopy':
        result = createSpreadsheetCopy();
        break;
      case 'submit':
        if (!data || !data.spreadsheetId) {
          throw new Error('No data or spreadsheetId provided');
        }
        result = handleSubmit(data);
        break;
      case 'sendEmail':
        if (!data || !data.spreadsheetId || !data.emailTo) {
          throw new Error('Missing required data for sending email');
        }
        const ss = SpreadsheetApp.openById(data.spreadsheetId);
        const emailResult = sendEmailWithSpreadsheet(ss, data.emailTo);
        result = {
          status: emailResult ? 'success' : 'error',
          message: emailResult ? 'Email sent successfully' : 'Failed to send email'
        };
        break;
      default:
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
    createAccuracyGraphs(sheet);
    
    const pdfBlob = ss.getAs('application/pdf');
    const pdfFile = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
    
    recordSubmission(data, ss.getUrl(), pdfFile.getUrl());
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

function writeAllData(sheet, data) {
  writeFacilityInfo(sheet, data);
  writeLowerLimitDetection(sheet, data);
  writePrecisionData(sheet, data);
  writeAccuracyData(sheet, data);
  writeMorphGradeFinal(sheet, data);
  writeQCData(sheet, data);
  setFormulas(sheet);
  createAccuracyGraphs(sheet);
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
  
  // Sensitivity and Specificity formulas with NA handling
  sheet.getRange('K54').setFormula('=IF(OR(L48=0,L51=0),"NA",L48/(L48+L51))');
  sheet.getRange('K56').setFormula('=IF(OR(L49=0,L50=0),"NA",L49/(L49+L50))');
}

function createAccuracyGraphs(sheet) {
  // Get data for calculations
  const data = {
    conc: [],
    motility: []
  };
  
  for (let i = 0; i < 5; i++) {
    const row = 48 + i;
    const sqaConc = sheet.getRange(`A${row}`).getValue();
    const manualConc = sheet.getRange(`B${row}`).getValue();
    const sqaMotility = sheet.getRange(`C${row}`).getValue();
    const manualMotility = sheet.getRange(`D${row}`).getValue();
    
    if (sqaConc && manualConc) {
      data.conc.push([manualConc, sqaConc]);
    }
    if (sqaMotility && manualMotility) {
      data.motility.push([manualMotility, sqaMotility]);
    }
  }
  
  // Calculate R² values
  const concR2 = calculateRSquared(data.conc);
  const motilityR2 = calculateRSquared(data.motility);
  
  // Write R² values to cells
  sheet.getRange('F85').setValue(concR2);
  sheet.getRange('F91').setValue(motilityR2);
  
  // Create charts
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

  // Insert charts
  sheet.insertChart(concentrationChart);
  sheet.insertChart(motilityChart);
  
  console.log("Created accuracy graphs with R² values:", { concR2, motilityR2 });
}

function calculateRSquared(data) {
  if (data.length < 2) return 0;
  
  let sumX = 0, sumY = 0;
  for (const [x, y] of data) {
    sumX += x;
    sumY += y;
  }
  const meanX = sumX / data.length;
  const meanY = sumY / data.length;
  
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
  return Math.round(rSquared * 1000) / 1000;
}

function sendEmailWithSpreadsheet(spreadsheet, recipientEmail) {
  const sheet = spreadsheet.getActiveSheet();
  if (!sheet) {
    throw new Error('No active sheet found');
  }
  
  // Generate PDF of the sheet
  const pdfBlob = spreadsheet.getAs('application/pdf').setName('SQA Data.pdf');
  
  const emailSubject = 'New SQA Data Submission';
  const emailBody = 'A new SQA data submission has been recorded.\n\n' +
                   'Sheet Name: ' + sheet.getName() + '\n' +
                   'Date: ' + new Date().toLocaleDateString() + '\n\n' +
                   'You can access the spreadsheet here: ' + spreadsheet.getUrl() + '\n\n' +
                   'A PDF version is attached to this email.\n\n' +
                   'This is an automated message.';
  
  GmailApp.sendEmail(
    recipientEmail,
    emailSubject,
    emailBody,
    {
      attachments: [pdfBlob],
      name: 'SQA Data System'
    }
  );
  
  return true;
}

function recordSubmission(data, spreadsheetUrl, pdfUrl) {
  const logSheet = SpreadsheetApp.openById(LOG_SPREADSHEET_ID).getActiveSheet();
  const timestamp = new Date();
  
  logSheet.appendRow([
    timestamp,
    data.facility,
    data.technician,
    data.serialNumber,
    data.date,
    spreadsheetUrl,
    pdfUrl
  ]);
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const adminEmail = ADMIN_EMAIL;
  const subject = `New SQA Submission - ${data.facility}`;
  const body = `
    New SQA submission received:
    
    Facility: ${data.facility}
    Technician: ${data.technician}
    Serial Number: ${data.serialNumber}
    Date: ${data.date}
    
    Spreadsheet: ${spreadsheetUrl}
    PDF: ${pdfUrl}
    
    This is an automated notification.
  `;
  
  GmailApp.sendEmail(adminEmail, subject, body);
}