function handleSubmit(data) {
  console.log("Starting handleSubmit with data:", data);
  
  try {
    // Format the date for the filename
    const dateObj = new Date(data.date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    // Sanitize facility name and serial number
    const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
    const cleanSerialNumber = data.serialNumber.trim().replace(/[^a-zA-Z0-9]/g, '');
    
    // Create new filename format
    const fileName = `${formattedDate}-${cleanSerialNumber}-${sanitizedFacility}`;
    
    // Create new spreadsheet from template
    const templateFile = DriveApp.getFileById(TEMPLATE_SPREADSHEET_ID);
    const newFile = templateFile.makeCopy(fileName);
    const ss = SpreadsheetApp.openById(newFile.getId());
    const sheet = ss.getSheets()[0];
    
    // Write data to spreadsheet
    writeAllData(sheet, data);
    
    // Set formulas
    setFormulas(sheet);
    
    // Ensure all calculations are completed
    SpreadsheetApp.flush();
    
    // Generate PDF with specific settings
    const pdfBlob = ss.getAs(MimeType.PDF).setName(`${fileName}.pdf`);
    const pdfFile = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(pdfBlob);
    
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