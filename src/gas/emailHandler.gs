function logEmailSend(data, spreadsheetUrl, pdfUrl) {
  try {
    const logSheet = SpreadsheetApp.openById(EMAIL_LOG_SPREADSHEET_ID).getActiveSheet();
    const timestamp = new Date();
    
    // Add new row with email send data
    logSheet.appendRow([
      timestamp,
      data.facility,
      data.date,
      data.technician,
      data.serialNumber,
      data.emailTo,
      data.phone,
      spreadsheetUrl,
      pdfUrl
    ]);
    
    console.log("Email send logged successfully");
  } catch (error) {
    console.error("Error logging email send:", error);
  }
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
  
  // Log the email send after sending notification
  logEmailSend(data, spreadsheetUrl, pdfUrl);
}