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
    'A10:C18',  // Lower Limit Detection
    'A22:D30',  // Precision Level 1
    'A34:D42',  // Precision Level 2
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
  
  // Set header formatting
  const headers = ['A8', 'A20', 'A32', 'A44', 'A67'];
  headers.forEach(cell => {
    const header = sheet.getRange(cell);
    header.setFontWeight('bold');
    header.setBackground('#F0F0F0');
  });
  
  // Add descriptions
  sheet.getRange('A9').setValue('Materials: QwikCheck beads (Negative Control) - Pass Criteria: Conc. = 0.0, MSC = 0.0');
  sheet.getRange('A21').setValue('Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%');
  sheet.getRange('A33').setValue('Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%');
  sheet.getRange('A45').setValue('Materials: Live Human Semen - Manual vs. SQA Comparison');
  sheet.getRange('A68').setValue('Materials: QwikCheck QC Beads - Pass Criteria: Conc. < 10%');
  
  // Add accuracy outcome section
  sheet.getRange('A58:K58').merge();
  sheet.getRange('A58').setValue('SQA ACCURACY OUTCOME');
  sheet.getRange('A58').setHorizontalAlignment('center');
  sheet.getRange('A58').setBackground('#F0F0F0');
  sheet.getRange('A58').setFontWeight('bold');
  
  // Add accuracy criteria section
  const criteriaRange = sheet.getRange('A76:B78');
  criteriaRange.setBorder(true, true, true, true, true, true);
  sheet.getRange('A76').setValue('Accuracy - Recommended Pass Critieria');
  sheet.getRange('A77').setValue('Concentration:');
  sheet.getRange('B77').setValue('Hit within 15% of the manufacturer\'s clinical claims = Correlation: >0.765, Sensitivity: >76.5%, Specificity: >72.3%');
  sheet.getRange('A78').setValue('Motility:');
  sheet.getRange('B78').setValue('Hit within 15% of manufacturer\'s clinical claims = Correlation: >0.680, Sensitivity: >72.3%, Specificity: >68.0%');
  sheet.getRange('A79').setValue('Morphology:');
  sheet.getRange('B79').setValue('Hit within 15% of manufacturer\'s clinical claims = Sensitivity: >68.0%, Specificity: >76.5%');
}