export interface FormData {
  facility: string;
  date: string;
  technician: string;
  serialNumber: string;
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
  };
  qc: {
    level1: string[];
    level2: string[];
  };
}

export interface GoogleScriptResponse {
  status: 'success' | 'error';
  message?: string;
}