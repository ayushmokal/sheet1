interface AccuracyGraphProps {
  data: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
  };
}

export function AccuracyGraph({ data }: AccuracyGraphProps) {
  return null; // Graphs are now generated in the spreadsheet
}