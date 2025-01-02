import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccuracyGraphProps {
  data: {
    sqa: string[];
    manual: string[];
    sqaMotility: string[];
    manualMotility: string[];
  };
}

export function AccuracyGraph({ data }: AccuracyGraphProps) {
  // Transform concentration data
  const concentrationData = data.manual.map((manual, index) => ({
    x: Number(manual) || 0,
    y: Number(data.sqa[index]) || 0,
  })).filter(point => point.x !== 0 && point.y !== 0);

  // Transform motility data
  const motilityData = data.manualMotility.map((manual, index) => ({
    x: Number(manual) || 0,
    y: Number(data.sqaMotility[index]) || 0,
  })).filter(point => point.x !== 0 && point.y !== 0);

  // Calculate R² value for concentration
  const calculateRSquared = (data: { x: number; y: number }[]) => {
    if (data.length < 2) return 0;

    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    
    const xMean = xValues.reduce((a, b) => a + b) / xValues.length;
    const yMean = yValues.reduce((a, b) => a + b) / yValues.length;
    
    const ssRes = data.reduce((sum, point) => {
      const yPred = point.x; // Assuming a 1:1 relationship
      return sum + Math.pow(point.y - yPred, 2);
    }, 0);
    
    const ssTot = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    
    return 1 - (ssRes / ssTot);
  };

  const concentrationRSquared = calculateRSquared(concentrationData);
  const motilityRSquared = calculateRSquared(motilityData);

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">SQA Accuracy: Sperm Concentration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px] relative">
            <ScatterChart
              width={800}
              height={400}
              margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x"
                name="Manual"
                domain={[0, 'auto']}
                tickCount={8}
              >
                <Label value="Manual Sperm Conc., M/ml" offset={-20} position="insideBottom" />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y"
                name="SQA"
                domain={[0, 'auto']}
                tickCount={8}
              >
                <Label value="SQA Sperm Conc., M/ml" angle={-90} position="insideLeft" offset={10} />
              </YAxis>
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: number) => [`${value.toFixed(1)} M/ml`]}
              />
              <Scatter
                name="Concentration"
                data={concentrationData}
                fill="#1A73E8"
                line={{ stroke: '#1A73E8', strokeWidth: 2 }}
                lineType="fitting"
              />
            </ScatterChart>
            <div className="text-center text-sm text-blue-600 font-medium mt-2">
              R² = {concentrationRSquared.toFixed(4)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">SQA Accuracy: Motility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[500px] relative">
            <ScatterChart
              width={800}
              height={400}
              margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x"
                name="Manual"
                domain={[0, 100]}
                tickCount={6}
              >
                <Label value="Manual Motility, %" offset={-20} position="insideBottom" />
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y"
                name="SQA"
                domain={[0, 100]}
                tickCount={6}
              >
                <Label value="SQA Motility, %" angle={-90} position="insideLeft" offset={10} />
              </YAxis>
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: number) => [`${value.toFixed(1)}%`]}
              />
              <Scatter
                name="Motility"
                data={motilityData}
                fill="#9333EA"
                line={{ stroke: '#9333EA', strokeWidth: 2 }}
                lineType="fitting"
              />
            </ScatterChart>
            <div className="text-center text-sm text-purple-600 font-medium mt-2">
              R² = {motilityRSquared.toFixed(4)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}