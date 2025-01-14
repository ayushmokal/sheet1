export const spreadsheetHandling = `
function generateUniqueSheetName(spreadsheet, data) {
  const formattedDate = formatDate(data.date);
  const sanitizedFacility = data.facility.replace(/[^a-zA-Z0-9]/g, '');
  const cleanSerialNumber = data.serialNumber.trim();
  
  const baseSheetName = formattedDate + '-' + cleanSerialNumber + '-' + sanitizedFacility;
  
  const existingSheets = spreadsheet.getSheets().map(sheet => sheet.getName());
  if (existingSheets.includes(baseSheetName)) {
    throw new Error('A submission with this date, serial number, and facility already exists');
  }
  
  return baseSheetName;
}

function copySheetFormatting(sourceRange, targetRange, originalSheet, targetSheet) {
  // Copy all formatting
  targetRange.setBackgrounds(sourceRange.getBackgrounds());
  targetRange.setFontColors(sourceRange.getFontColors());
  targetRange.setFontFamilies(sourceRange.getFontFamilies());
  targetRange.setFontLines(sourceRange.getFontLines());
  targetRange.setFontStyles(sourceRange.getFontStyles());
  targetRange.setFontWeights(sourceRange.getFontWeights());
  targetRange.setHorizontalAlignments(sourceRange.getHorizontalAlignments());
  targetRange.setVerticalAlignments(sourceRange.getVerticalAlignments());
  targetRange.setNumberFormats(sourceRange.getNumberFormats());
  targetRange.setTextRotations(sourceRange.getTextRotations());
  targetRange.setWraps(sourceRange.getWraps());
  
  // Copy merged ranges
  const mergedRanges = sourceRange.getMergedRanges();
  mergedRanges.forEach(range => {
    const row = range.getRow();
    const col = range.getColumn();
    const numRows = range.getNumRows();
    const numCols = range.getNumColumns();
    targetSheet.getRange(row, col, numRows, numCols).merge();
  });
  
  // Copy conditional formatting rules
  const rules = originalSheet.getConditionalFormatRules();
  targetSheet.setConditionalFormatRules(rules);
}
`;