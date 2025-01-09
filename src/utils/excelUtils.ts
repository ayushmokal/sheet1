import * as XLSX from 'xlsx';
import { SQAFormData } from '@/types/form';

export const generateExcelFile = (data: SQAFormData): Blob => {
  // Create a new workbook with a single sheet
  const wb = XLSX.utils.book_new();
  
  // Create the worksheet with the header and form data
  const ws = XLSX.utils.aoa_to_sheet([
    ['SQA Precision / Accuracy / Lower Limit Detection Study - 5 Replicates'],
    [''],  // Empty row for spacing
    ['Facility:', data.facility],
    ['Date:', data.date],
    ['Technician:', data.technician],
    ['Serial Number:', data.serialNumber],
  ]);

  // Set column widths
  ws['!cols'] = [
    { width: 20 }, // Column A
    { width: 30 }, // Column B
    { width: 15 }, // Column C
    { width: 15 }, // Column D
    { width: 15 }, // Column E
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'SQA Study');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};