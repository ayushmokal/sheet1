export interface FormData {
  spreadsheetId?: string;
  facility: string;
  date: string;
  technician: string;
  serialNumber: string;
  emailTo: string;
  phone: string;
  lowerLimitDetection: {
    conc: string[];
    msc: string[];
  };
  precisionLevel1: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  precisionLevel2: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  accuracy: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
    sqaMorph: string[];
    manualMorph: string[];
    morphGradeFinal: {
      tp: string;
      tn: string;
      fp: string;
      fn: string;
    };
  };
  qc: {
    level1: string[];
    level2: string[];
  };
}

export interface GoogleScriptResponse {
  status: 'success' | 'error';
  message: string;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  sheetName?: string;
}