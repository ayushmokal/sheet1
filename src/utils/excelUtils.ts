import * as XLSX from 'xlsx';
import { FormData } from '@/types/form';

export const generateExcelFile = (data: FormData): Blob => {
  const wb = XLSX.utils.book_new();
  
  // Create worksheets for each section
  const facilityInfo = [
    ['Facility', data.facility],
    ['Date', data.date],
    ['Technician', data.technician],
    ['Serial Number', data.serialNumber],
  ];
  
  const lowerLimitSheet = [
    ['LOWER LIMIT DETECTION'],
    ['', 'Conc. Value', 'MSC Value'],
    ...data.lowerLimitDetection.conc.map((conc, i) => [
      `Sample ${i + 1}`,
      conc,
      data.lowerLimitDetection.msc[i]
    ])
  ];
  
  const precisionLevel1Sheet = [
    ['PRECISION & SENSITIVITY - LEVEL 1'],
    ['', 'Conc. (M/mL)', 'Motility (%)', 'Morph. (%)'],
    ...data.precisionLevel1.conc.map((conc, i) => [
      `Sample ${i + 1}`,
      conc,
      data.precisionLevel1.motility[i],
      data.precisionLevel1.morph[i]
    ])
  ];
  
  const precisionLevel2Sheet = [
    ['PRECISION & SENSITIVITY - LEVEL 2'],
    ['', 'Conc. (M/mL)', 'Motility (%)', 'Morph. (%)'],
    ...data.precisionLevel2.conc.map((conc, i) => [
      `Sample ${i + 1}`,
      conc,
      data.precisionLevel2.motility[i],
      data.precisionLevel2.morph[i]
    ])
  ];
  
  const accuracySheet = [
    ['ACCURACY'],
    ['', 'SQA', 'Manual', 'SQA Motility', 'Manual Motility', 'SQA Morph', 'Manual Morph'],
    ...data.accuracy.sqa.map((sqa, i) => [
      `Sample ${i + 1}`,
      sqa,
      data.accuracy.manual[i],
      data.accuracy.sqaMotility[i],
      data.accuracy.manualMotility[i],
      data.accuracy.sqaMorph[i],
      data.accuracy.manualMorph[i]
    ])
  ];
  
  const qcSheet = [
    ['PRECISION & SENSITIVITY - QC'],
    ['', 'Level 1', 'Level 2'],
    ...data.qc.level1.map((level1, i) => [
      `Sample ${i + 1}`,
      level1,
      data.qc.level2[i]
    ])
  ];
  
  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(facilityInfo), 'Facility Info');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(lowerLimitSheet), 'Lower Limit Detection');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(precisionLevel1Sheet), 'Precision Level 1');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(precisionLevel2Sheet), 'Precision Level 2');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(accuracySheet), 'Accuracy');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(qcSheet), 'QC');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};