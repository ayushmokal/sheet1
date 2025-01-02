import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccuracyGraphProps {
  data: {
    sqa: string[];
    manual: string[];
  };
}

export function AccuracyGraph({ data }: AccuracyGraphProps) {
  // Transform the data into the format required by recharts
  const scatterData = data.manual.map((manual, index) => ({
    x: Number(manual) || 0,
    y: Number(data.sqa[index]) || 0,
  })).filter(point => point.x !== 0 && point.y !== 0); // Filter out empty or zero values

  // Calculate R² value
  const calculateRSquared = () => {
    if (scatterData.length < 2) return 0;

    const xValues = scatterData.map(d => d.x);
    const yValues = scatterData.map(d => d.y);
    
    const xMean = xValues.reduce((a, b) => a + b) / xValues.length;
    const yMean = yValues.reduce((a, b) => a + b) / yValues.length;
    
    const ssRes = scatterData.reduce((sum, point) => {
      const yPred = point.x; // Assuming a 1:1 relationship
      return sum + Math.pow(point.y - yPred, 2);
    }, 0);
    
    const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    
    return 1 - (ssRes / ssTot);
  };

  const rSquared = calculateRSquared();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">SQA Accuracy: Sperm Concentration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <ScatterChart
            width={500}
            height={300}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x"
              name="Manual"
              unit=" M/ml"
            >
              <Label value="Manual Sperm Conc., M/ml" offset={-20} position="insideBottom" />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y"
              name="SQA"
              unit=" M/ml"
            >
              <Label value="SQA Sperm Conc., M/ml" angle={-90} position="insideLeft" offset={10} />
            </YAxis>
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number) => [`${value.toFixed(1)} M/ml`]}
            />
            <Scatter
              name="Concentration"
              data={scatterData}
              fill="#2563eb"
            />
          </ScatterChart>
          <div className="text-center text-sm text-blue-600 font-medium mt-2">
            R² = {rSquared.toFixed(4)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}