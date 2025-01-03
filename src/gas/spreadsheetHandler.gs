function createSpreadsheetCopy() {
  try {
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const newFile = templateFile.makeCopy('SQA Data Collection Form (Copy)');
    const newSpreadsheet = SpreadsheetApp.openById(newFile.getId());
    
    newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    const secondFile = templateFile.makeCopy('SQA Data Collection Form (Copy 2)');
    secondFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    return {
      status: 'success',
      spreadsheetId: newFile.getId(),
      spreadsheetUrl: newSpreadsheet.getUrl(),
      secondSpreadsheetId: secondFile.getId(),
      secondSpreadsheetUrl: SpreadsheetApp.openById(secondFile.getId()).getUrl()
    };
  } catch (error) {
    console.error('Error in createSpreadsheetCopy:', error);
    throw new Error('Failed to create spreadsheet copy: ' + error.message);
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