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
  
  // Calculate R² values
  const concR2 = calculateRSquared(concData);
  const motilityR2 = calculateRSquared(motilityData);
  
  // Write R² values to specified cells
  sheet.getRange('F85').setValue(concR2);
  sheet.getRange('F91').setValue(motilityR2);
  
  // Create concentration scatter plot
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
  
  // Create motility scatter plot
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

  sheet.insertChart(concentrationChart);
  sheet.insertChart(motilityChart);
  
  console.log("Created accuracy graphs with R² values");
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