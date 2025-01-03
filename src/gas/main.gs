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
        result = sendEmailWithSpreadsheet(ss, data.emailTo);
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