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
  
  // Accuracy formulas
  sheet.getRange('L48').setFormula('=COUNTIF(G48:J52,"TP")');
  sheet.getRange('L49').setFormula('=COUNTIF(G48:J52,"TN")');
  sheet.getRange('L50').setFormula('=COUNTIF(G48:J52,"FP")');
  sheet.getRange('L51').setFormula('=COUNTIF(G48:J52,"FN")');
  sheet.getRange('K54').setFormula('=L48/(L48+L51)');
  sheet.getRange('K56').setFormula('=L49/(L49+L50)');
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
  
  // Calculate and write R² values
  const concR2 = calculateRSquared(concData);
  const motilityR2 = calculateRSquared(motilityData);
  
  // Write R² values to specified cells
  sheet.getRange('F85').setValue(concR2);
  sheet.getRange('F91').setValue(motilityR2);
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