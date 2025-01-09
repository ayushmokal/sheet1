import { SQAFormData } from "@/types/form";

export const initialFormData: SQAFormData = {
  facility: "",
  date: "",
  technician: "",
  serialNumber: "",
  emailTo: "",
  phone: "",
  lowerLimitDetection: {
    conc: Array(5).fill(""),
    msc: Array(5).fill("")
  },
  precisionLevel1: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill("")
  },
  precisionLevel2: {
    conc: Array(5).fill(""),
    motility: Array(5).fill(""),
    morph: Array(5).fill("")
  },
  accuracy: {
    sqa: Array(5).fill(""),
    manual: Array(5).fill(""),
    sqaMotility: Array(5).fill(""),
    manualMotility: Array(5).fill(""),
    sqaMorph: Array(5).fill(""),
    manualMorph: Array(5).fill(""),
    morphGradeFinal: {
      tp: "",
      tn: "",
      fp: "",
      fn: ""
    }
  },
  qc: {
    level1: Array(5).fill(""),
    level2: Array(5).fill("")
  }
};

export const getTestData = (): SQAFormData => ({
  facility: "Test Facility",
  date: "2024-03-20",
  technician: "John Doe",
  serialNumber: "12345",
  emailTo: "test@example.com",
  phone: "123-456-7890",
  lowerLimitDetection: {
    conc: Array(5).fill("1.0"),
    msc: Array(5).fill("0.5")
  },
  precisionLevel1: {
    conc: Array(5).fill("2.0"),
    motility: Array(5).fill("60"),
    morph: Array(5).fill("14")
  },
  precisionLevel2: {
    conc: Array(5).fill("20.0"),
    motility: Array(5).fill("40"),
    morph: Array(5).fill("10")
  },
  accuracy: {
    sqa: ["11.2", "51.7", "47.0", "63.0", "149.4"],
    manual: ["18.0", "47.8", "44.9", "45.1", "141.1"],
    sqaMotility: ["4.0", "59.0", "48.0", "45.0", "45.0"],
    manualMotility: ["3.3", "57.5", "41.0", "54.0", "54.0"],
    sqaMorph: ["1.0", "1.0", "1.0", "1.0", "1.0"],
    manualMorph: ["1.0", "1.0", "1.0", "1.0", "1.0"],
    morphGradeFinal: {
      tp: "TP",
      tn: "TN",
      fp: "FP",
      fn: "FN"
    }
  },
  qc: {
    level1: Array(5).fill("5.0"),
    level2: Array(5).fill("25.0")
  }
});