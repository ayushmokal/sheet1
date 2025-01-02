import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QCSectionProps {
  data: {
    level1: string[];
    level2: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function QCSection({ data, handleInputChange }: QCSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Precision & Sensitivity - QC</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sample #</TableHead>
              <TableHead>Level 1 Conc.</TableHead>
              <TableHead>Level 2 Conc.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((num, index) => (
              <TableRow key={`qc-${num}`}>
                <TableCell className="font-medium">{num}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.level1[index]}
                    onChange={(e) => handleInputChange("qc", "level1", e.target.value, index)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.1"
                    value={data.level2[index]}
                    onChange={(e) => handleInputChange("qc", "level2", e.target.value, index)}
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