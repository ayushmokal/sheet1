import * as XLSX from 'xlsx';
import { SQAFormData } from '@/types/form';

const calculateMeanAndCV = (values: string[]) => {
  const numbers = values.map(v => parseFloat(v) || 0);
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  const cv = mean !== 0 ? Math.sqrt(variance) / mean : 0;
  return { mean, cv };
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
    ['Sample #', 'Conc. Value', 'MSC Value', '', '', 'ANALYTICAL SENSITIVITY'],
  ]);

  // Add Lower Limit Detection data
  const lldData = Array.from({ length: 5 }, (_, i) => [
    i + 1,
    data.lowerLimitDetection.conc[i] || '',
    data.lowerLimitDetection.msc[i] || ''
  ]);

  // Calculate mean and CV for LLD
  const concStats = calculateMeanAndCV(data.lowerLimitDetection.conc);
  const mscStats = calculateMeanAndCV(data.lowerLimitDetection.msc);
  
  lldData.push(
    ['Mean', concStats.mean.toFixed(2), mscStats.mean.toFixed(2)],
    ['CV', concStats.cv.toFixed(2), mscStats.cv.toFixed(2)]
  );

  // Add Precision Level 1 section
  const precisionL1Start = lldData.length + 12;
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

  // Add Precision Level 2 section
  const precisionL2Start = precisionL1Start + l1Data.length + 5;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['PRECISION & SENSITIVITY - LEVEL 2'],
    ['Materials: Live Human Semen - Pass Criteria: Conc. < 10%, Motility < 10%, Morphology < 20%'],
    ['Sample #', 'Conc. (M/mL)', 'Motility (%)', 'Morph. (%)', '', 'SQA PRECISION']
  ], { origin: precisionL2Start });

  // Add Accuracy section
  const accuracyStart = precisionL2Start + l1Data.length + 5;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['ACCURACY (OPTIONAL)'],
    ['Materials: Live Human Semen - Manual vs. SQA Comparison'],
    ['', '', '', '', '', '', '', 'Reference Cutoff, %:', '4'],
    ['CONC., M/ml', '', 'MOTILITY, %', '', 'MORPHOLOGY, %', '', 'Morph. Grade', '', 'Morph. Grade Final'],
    ['SQA', 'Manual', 'SQA', 'Manual', 'SQA', 'Manual']
  ], { origin: accuracyStart });

  // Add QC section
  const qcStart = accuracyStart + 15;
  XLSX.utils.sheet_add_aoa(ws, [
    [],
    ['PRECISION & SENSITIVITY - QC'],
    ['Materials: QwikCheck QC Beads - Pass Criteria: Conc. < 10%'],
    ['Sample #', 'Level 1 Conc. (M/mL)', 'Level 2 Conc. (M/mL)', 'SQA PRECISION']
  ], { origin: qcStart });

  // Add recommended pass criteria
  const criteriaStart = qcStart + 10;
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
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'SQA Study');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};