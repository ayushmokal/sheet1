function sendEmailWithSpreadsheet(spreadsheet, recipientEmail) {
  try {
    const spreadsheetUrl = spreadsheet.getUrl();
    
    const emailSubject = 'SQA Data Submission';
    const emailBody = 'Please find attached the SQA data submission spreadsheet.\n\n' +
                     'You can access the spreadsheet directly here: ' + spreadsheetUrl + '\n\n' +
                     'This is an automated message.';
    
    const spreadsheetFile = DriveApp.getFileById(spreadsheet.getId());
    
    GmailApp.sendEmail(
      recipientEmail,
      emailSubject,
      emailBody,
      {
        attachments: [spreadsheetFile],
        name: 'SQA Data System'
      }
    );
    
    return {
      status: 'success',
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}

function recordSubmission(data, spreadsheetUrl, pdfUrl) {
  console.log("Recording submission:", {
    date: new Date(),
    facility: data.facility,
    spreadsheetUrl: spreadsheetUrl,
    pdfUrl: pdfUrl
  });
}

function sendAdminNotification(data, spreadsheetUrl, pdfUrl) {
  const subject = 'New SQA Data Submission - ' + data.facility;
  const body = `New SQA data submission received:
    
Facility: ${data.facility}
Date: ${data.date}
Technician: ${data.technician}
Serial Number: ${data.serialNumber}

Spreadsheet: ${spreadsheetUrl}
PDF: ${pdfUrl}`;

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
}