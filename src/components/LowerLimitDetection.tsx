import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface LowerLimitDetectionProps {
  data: {
    conc: string[];
    msc: string[];
  };
  handleInputChange: (section: string, field: string, value: string, index: number) => void;
}

export function LowerLimitDetection({ data, handleInputChange }: LowerLimitDetectionProps) {
  const { toast } = useToast();

  const validateNonZero = (value: string, field: string, index: number) => {
    const numValue = parseFloat(value);
    if (value && numValue === 0) {
      toast({
        title: "Invalid Input",
        description: "Value cannot be zero",
        variant: "destructive",
      });
      return;
    }
    handleInputChange("lowerLimitDetection", field, value, index);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Lower Limit Detection</CardTitle>
        <p className="text-sm text-muted-foreground">
          Materials: QwikCheck beads (Negative Control) - Pass Criteria: Conc. = 0.0, MSC = 0.0
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sample #</TableHead>
              <TableHead>Conc. Value</TableHead>
              <TableHead>MSC Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((num, index) => (
              <TableRow key={`lld-${num}`}>
                <TableCell className="font-medium">{num}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.conc[index]}
                    onChange={(e) => validateNonZero(e.target.value, "conc", index)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={data.msc[index]}
                    onChange={(e) => validateNonZero(e.target.value, "msc", index)}
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