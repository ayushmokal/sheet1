function applySpreadsheetStyling(sheet) {
  // Set title formatting
  const title = sheet.getRange('A1');
  title.setFontSize(14);
  title.setFontWeight('bold');
  title.setBackground('#F0F0F0');
  
  // Format header section
  const headerRange = sheet.getRange('A3:H6');
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Format tables
  const tables = [
    'A10:C16',  // Lower Limit Detection
    'A22:D28',  // Precision Level 1
    'A34:D40',  // Precision Level 2
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
}