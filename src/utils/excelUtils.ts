import * as XLSX from 'xlsx';
import { SQAFormData } from '@/types/form';

const calculateMeanAndCV = (values: string[]) => {
  const numbers = values.map(v => parseFloat(v) || 0);
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  const cv = mean !== 0 ? (Math.sqrt(variance) / mean) * 100 : 0;
  return { mean: mean.toFixed(2), cv: cv.toFixed(2) };
};

export const generateExcelFile = (data: SQAFormData): Blob => {
  const wb = XLSX.utils.book_new();
  
  // Create the main worksheet
  const ws = XLSX.utils.aoa_to_sheet([
    ['SQA Precision / Accuracy / Lower Limit Detection Study - 5 Replicates'],
    [],
    ['Facility:', data.facility],
    ['Date:', data.date],
    ['Technician:', data.technician],
    ['Serial Number:', data.serialNumber],
    [],
    ['LOWER LIMIT DETECTION'],
    ['Materials: QwikCheck beads (Negative Control) - Pass Criteria: Conc. = 0.0, MSC = 0.0'],
    ['Sample #', 'Conc. Value', 'MSC Value', '', '', 'ANALYTICAL'],
    ['', '', '', '', '', 'SENSITIVITY'],
  ]);

  // Add Lower Limit Detection data
  const lldData = Array.from({ length: 5 }, (_, i) => [
    i + 1,
    data.lowerLimitDetection.conc[i] || '0.0',
    data.lowerLimitDetection.msc[i] || '0.0'
  ]);

  // Calculate mean and CV for LLD
  const lldConcStats = calculateMeanAndCV(data.lowerLimitDetection.conc);
  const lldMscStats = calculateMeanAndCV(data.lowerLimitDetection.msc);
  
  lldData.push(
    ['Mean', lldConcStats.mean, lldMscStats.mean],
    ['CV', lldConcStats.cv, lldMscStats.cv],
    [],
    ['', '', '', '', '', 'PASS']
  );

  XLSX.utils.sheet_add_aoa(ws, lldData, { origin: 11 });

  // Add Precision Level 1 section
  const precisionL1Start = 20;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['PRECISION & SENSITIVITY - LEVEL 1'],
    ['Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%'],
    ['Sample #', 'Conc. (M/mL)', 'Motility (%)', 'Morph. (%)', '', 'SQA PRECISION']
  ], { origin: precisionL1Start });

  // Add Precision Level 1 data
  const l1Data = Array.from({ length: 5 }, (_, i) => [
    i + 1,
    data.precisionLevel1.conc[i] || '',
    data.precisionLevel1.motility[i] || '',
    data.precisionLevel1.morph[i] || ''
  ]);

  const l1ConcStats = calculateMeanAndCV(data.precisionLevel1.conc);
  const l1MotStats = calculateMeanAndCV(data.precisionLevel1.motility);
  const l1MorphStats = calculateMeanAndCV(data.precisionLevel1.morph);

  l1Data.push(
    ['Mean', l1ConcStats.mean, l1MotStats.mean, l1MorphStats.mean],
    ['CV', l1ConcStats.cv, l1MotStats.cv, l1MorphStats.cv]
  );

  XLSX.utils.sheet_add_aoa(ws, l1Data, { origin: `A${precisionL1Start + 4}` });

  // Add Precision Level 2 section
  const precisionL2Start = precisionL1Start + l1Data.length + 5;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['PRECISION & SENSITIVITY - LEVEL 2'],
    ['Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%'],
    ['Sample #', 'Conc. (M/mL)', 'Motility (%)', 'Morph. (%)', '', 'SQA PRECISION']
  ], { origin: precisionL2Start });

  // Add Precision Level 2 data
  const l2Data = Array.from({ length: 5 }, (_, i) => [
    i + 1,
    data.precisionLevel2.conc[i] || '',
    data.precisionLevel2.motility[i] || '',
    data.precisionLevel2.morph[i] || ''
  ]);

  const l2ConcStats = calculateMeanAndCV(data.precisionLevel2.conc);
  const l2MotStats = calculateMeanAndCV(data.precisionLevel2.motility);
  const l2MorphStats = calculateMeanAndCV(data.precisionLevel2.morph);

  l2Data.push(
    ['Mean', l2ConcStats.mean, l2MotStats.mean, l2MorphStats.mean],
    ['CV', l2ConcStats.cv, l2MotStats.cv, l2MorphStats.cv]
  );

  XLSX.utils.sheet_add_aoa(ws, l2Data, { origin: `A${precisionL2Start + 4}` });

  // Add Accuracy section
  const accuracyStart = precisionL2Start + l2Data.length + 5;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['ACCURACY (OPTIONAL)'],
    ['Materials: Live Human Semen - Manual vs. SQA Comparison'],
    ['', '', '', '', '', '', '', 'Reference Cutoff, %:', '4'],
    ['CONC., M/ml', '', 'MOTILITY, %', '', 'MORPHOLOGY, %', '', 'Morph. Grade', '', 'Morph. Grade Final'],
    ['SQA', 'Manual', 'SQA', 'Manual', 'SQA', 'Manual']
  ], { origin: accuracyStart });

  // Add accuracy data
  const accuracyData = Array.from({ length: 5 }, (_, i) => [
    data.accuracy.sqa[i] || '',
    data.accuracy.manual[i] || '',
    data.accuracy.sqaMotility[i] || '',
    data.accuracy.manualMotility[i] || '',
    data.accuracy.sqaMorph[i] || '',
    data.accuracy.manualMorph[i] || ''
  ]);

  XLSX.utils.sheet_add_aoa(ws, accuracyData, { origin: `A${accuracyStart + 6}` });

  // Add morphology grade final data
  XLSX.utils.sheet_add_aoa(ws, [
    ['', '', '', '', '', '', '', 'TP', data.accuracy.morphGradeFinal.tp || '5'],
    ['', '', '', '', '', '', '', 'TN', data.accuracy.morphGradeFinal.tn || '0'],
    ['', '', '', '', '', '', '', 'FP', data.accuracy.morphGradeFinal.fp || '0'],
    ['', '', '', '', '', '', '', 'FN', data.accuracy.morphGradeFinal.fn || '0']
  ], { origin: `A${accuracyStart + 7}` });

  // Add QC section
  const qcStart = accuracyStart + 20;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['PRECISION & SENSITIVITY - QC'],
    ['Materials: QwikCheck QC Beads - Pass Criteria: Conc. < 10%'],
    ['Sample #', 'Level 1 Conc. (M/mL)', 'Level 2 Conc. (M/mL)', 'SQA PRECISION']
  ], { origin: qcStart });

  // Add QC data
  const qcData = Array.from({ length: 5 }, (_, i) => [
    i + 1,
    data.qc.level1[i] || '',
    data.qc.level2[i] || ''
  ]);

  const qcL1Stats = calculateMeanAndCV(data.qc.level1);
  const qcL2Stats = calculateMeanAndCV(data.qc.level2);

  qcData.push(
    ['Mean', qcL1Stats.mean, qcL2Stats.mean],
    ['CV', qcL1Stats.cv, qcL2Stats.cv]
  );

  XLSX.utils.sheet_add_aoa(ws, qcData, { origin: `A${qcStart + 4}` });

  // Add recommended pass criteria
  const criteriaStart = qcStart + qcData.length + 5;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['Accuracy - Recommended Pass Criteria'],
    ['Concentration:', 'Hit within 15% of the manufacturer\'s clinical claims = Correlation: >0.765, Sensitivity: >76.5%, Specificity: >72.3%'],
    ['Motility:', 'Hit within 15% of manufacturer\'s clinical claims = Correlation: >0.680, Sensitivity: >72.3%, Specificity: >68.0%'],
    ['Morphology:', 'Hit within 15% of manufacturer\'s clinical claims = Sensitivity: >68.0%, Specificity: >76.5%']
  ], { origin: criteriaStart });

  // Set column widths
  ws['!cols'] = [
    { width: 15 }, // A
    { width: 15 }, // B
    { width: 15 }, // C
    { width: 15 }, // D
    { width: 15 }, // E
    { width: 15 }, // F
    { width: 15 }, // G
    { width: 15 }, // H
    { width: 15 }, // I
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'SQA Study');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};