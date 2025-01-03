import { FormData } from "@/types/form";

export const initialFormData: FormData = {
  facility: "",
  date: "",
  technician: "",
  serialNumber: "",
  emailTo: "",
  phone: "",
  lowerLimitDetection: {
    conc: Array(10).fill(""),
    msc: Array(10).fill("")
  },
  precisionLevel1: {
    conc: Array(10).fill(""),
    motility: Array(10).fill(""),
    morph: Array(10).fill("")
  },
  precisionLevel2: {
    conc: Array(10).fill(""),
    motility: Array(10).fill(""),
    morph: Array(10).fill("")
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
    level1: Array(10).fill(""),
    level2: Array(10).fill("")
  }
};

export const getTestData = (): FormData => ({
  facility: "Test Facility",
  date: "2024-03-20",
  technician: "John Doe",
  serialNumber: "12345",
  emailTo: "test@example.com",
  phone: "123-456-7890",
  lowerLimitDetection: {
    conc: Array(10).fill("1.0"),
    msc: Array(10).fill("0.5")
  },
  precisionLevel1: {
    conc: Array(10).fill("2.0"),
    motility: Array(10).fill("60"),
    morph: Array(10).fill("14")
  },
  precisionLevel2: {
    conc: Array(10).fill("20.0"),
    motility: Array(10).fill("40"),
    morph: Array(10).fill("10")
  },
  accuracy: {
    sqa: Array(5).fill("15.0"),
    manual: Array(5).fill("14.0"),
    sqaMotility: Array(5).fill("55"),
    manualMotility: Array(5).fill("50"),
    sqaMorph: Array(5).fill("12"),
    manualMorph: Array(5).fill("11"),
    morphGradeFinal: {
      tp: "8",
      tn: "7",
      fp: "2",
      fn: "3"
    }
  },
  qc: {
    level1: Array(10).fill("5.0"),
    level2: Array(10).fill("25.0")
  }
});