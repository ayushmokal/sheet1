import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PrecisionSectionProps {
  level: number;
  data: {
    conc: string[];
    motility: string[];
    morph: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function PrecisionSection({ level, data, handleInputChange }: PrecisionSectionProps) {
  const section = `precisionLevel${level}`;
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Precision & Sensitivity - Level {level}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Materials: Live Human Semen - Pass Criteria: Conc. {'<'} 10%, Motility {'<'} 10%, Morphology {'<'} 20%
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sample #</TableHead>
              <TableHead>Conc. (M/mL)</TableHead>
              <TableHead>Motility (%)</TableHead>
              <TableHead>Morph. (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((num, index) => (
              <TableRow key={`ps${level}-${num}`}>
                <TableCell className="font-medium">{num}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.conc[index]}
                    onChange={(e) => handleInputChange(section, "conc", e.target.value, index)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.motility[index]}
                    onChange={(e) => handleInputChange(section, "motility", e.target.value, index)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.morph[index]}
                    onChange={(e) => handleInputChange(section, "morph", e.target.value, index)}
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}