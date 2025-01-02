import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AccuracyGraph } from "./AccuracyGraph";

interface AccuracySectionProps {
  data: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
    sqaMorph: string[];
    manualMorph: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function AccuracySection({ data, handleInputChange }: AccuracySectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Accuracy (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Materials: Live Human Semen - Manual vs. SQA Comparison
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-4">Concentration (M/ml)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample #</TableHead>
                    <TableHead>SQA</TableHead>
                    <TableHead>Manual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <TableRow key={`conc-${num}`}>
                      <TableCell className="font-medium">{num}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={data.sqa[index]}
                          onChange={(e) => handleInputChange("accuracy", "sqa", e.target.value, index)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={data.manual[index]}
                          onChange={(e) => handleInputChange("accuracy", "manual", e.target.value, index)}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <AccuracyGraph data={data} />

            <div>
              <h4 className="font-medium mb-4">Motility (%)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample #</TableHead>
                    <TableHead>SQA</TableHead>
                    <TableHead>Manual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <TableRow key={`mot-${num}`}>
                      <TableCell className="font-medium">{num}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={data.sqaMotility[index]}
                          onChange={(e) => handleInputChange("accuracy", "sqaMotility", e.target.value, index)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={data.manualMotility[index]}
                          onChange={(e) => handleInputChange("accuracy", "manualMotility", e.target.value, index)}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h4 className="font-medium mb-4">Morphology (%)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample #</TableHead>
                    <TableHead>SQA</TableHead>
                    <TableHead>Manual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((num, index) => (
                    <TableRow key={`morph-${num}`}>
                      <TableCell className="font-medium">{num}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={data.sqaMorph[index]}
                          onChange={(e) => handleInputChange("accuracy", "sqaMorph", e.target.value, index)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={data.manualMorph[index]}
                          onChange={(e) => handleInputChange("accuracy", "manualMorph", e.target.value, index)}
                          className="w-full"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}