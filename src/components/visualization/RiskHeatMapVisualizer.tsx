import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ZAxis, 
  ReferenceLine, 
  ResponsiveContainer
} from "recharts";
import { useForm } from "@/contexts/FormContext";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RiskHeatMapVisualizerProps {
  inherentScore?: string;
  residualScore?: string;
  previousInherentScore?: string;
  previousResidualScore?: string;
  riskName?: string;
  compact?: boolean;
}

const RiskHeatMapVisualizer: React.FC<RiskHeatMapVisualizerProps> = ({
  inherentScore = "0",
  residualScore = "0",
  previousInherentScore,
  previousResidualScore,
  riskName = "Current Risk",
  compact = false
}) => {
  const { formState } = useForm();
  const riskAppetite = formState.riskAppetite || { threshold: 3.0, color: "#f97316", level: "Medium" };
  
  const currentRiskData = [
    {
      x: parseFloat(inherentScore),
      y: parseFloat(residualScore),
      z: 100,
      name: riskName,
      isCurrent: true
    }
  ];
  
  const previousRiskData = previousInherentScore && previousResidualScore ? [
    {
      x: parseFloat(previousInherentScore),
      y: parseFloat(previousResidualScore),
      z: 80,
      name: `Previous ${riskName}`,
      isCurrent: false
    }
  ] : [];

  const riskData = [...currentRiskData, ...previousRiskData];
  
  const chartConfig = {
    current: { color: "#3b82f6", label: "Current Assessment" },
    previous: { color: "#9ca3af", label: "Previous Assessment" },
    inherent: { color: "#ef4444", label: "Inherent Risk" },
    residual: { color: "#22c55e", label: "Residual Risk" },
    appetite: { color: riskAppetite.color, label: "Risk Appetite" }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "#ef4444";
    if (score >= 3) return "#f97316";
    if (score >= 2) return "#22c55e";
    return "#22c55e";
  };

  const appetiteThreshold = parseFloat(riskAppetite.threshold.toString());

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className={compact ? "px-2 py-3" : ""}>
        <div className="flex justify-between items-center">
          <CardTitle className={compact ? "text-base" : ""}>Risk Heat Map</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>This heat map visualizes the inherent risk (X-axis) versus the residual risk (Y-axis). The gradient areas represent different risk levels, and the appetite threshold line shows your organization's risk tolerance.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className={compact ? "px-2 py-0" : ""}>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Badge className="bg-blue-500">
                  Inherent: {inherentScore}
                </Badge>
                <span className="text-sm">→</span>
                <Badge className="bg-green-500">
                  Residual: {residualScore}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: riskAppetite.color }}></div>
              <span className="text-xs text-muted-foreground">Appetite Threshold: {riskAppetite.threshold}</span>
            </div>
          </div>
          
          <div style={{ width: '100%', height: compact ? 300 : 400 }}>
            <ChartContainer
              className="rounded-md border p-2"
              config={chartConfig}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 30,
                  }}
                >
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
                      <stop offset="25%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="50%" stopColor="#eab308" stopOpacity={0.8} />
                      <stop offset="75%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Inherent Risk" 
                    domain={[0, 5]} 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Inherent Risk', position: 'insideBottom', offset: -5, fontSize: 12 }}
                  />
                  
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Residual Risk" 
                    domain={[0, 5]} 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Residual Risk', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  
                  <ZAxis type="number" dataKey="z" range={[100, 500]} />

                  <rect x="0" y="0" width="100%" height="100%" fill="url(#colorGradient)" opacity={0.2} />

                  <ReferenceLine 
                    y={appetiteThreshold} 
                    stroke={riskAppetite.color} 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    label={{ 
                      value: 'Risk Appetite Threshold', 
                      position: 'right', 
                      fill: riskAppetite.color,
                      fontSize: 10
                    }} 
                  />

                  <ReferenceLine 
                    x={appetiteThreshold} 
                    stroke={riskAppetite.color} 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    label={{ 
                      value: 'Risk Appetite Threshold', 
                      position: 'top', 
                      fill: riskAppetite.color,
                      fontSize: 10
                    }} 
                  />

                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                    cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  
                  <Scatter 
                    name="Current" 
                    data={currentRiskData} 
                    fill="#3b82f6" 
                    line={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                    shape={(props: any) => {
                      const { cx, cy, fill } = props;
                      return (
                        <g>
                          <circle cx={cx} cy={cy} r={10} fill={fill} stroke="#fff" strokeWidth={2} />
                          <circle cx={cx} cy={cy} r={14} fill="transparent" stroke={fill} strokeWidth={2} strokeDasharray="2 2" />
                        </g>
                      );
                    }}
                  />
                  
                  {previousRiskData.length > 0 && (
                    <Scatter 
                      name="Previous" 
                      data={previousRiskData} 
                      fill="#9ca3af"
                      shape={(props: any) => {
                        const { cx, cy, fill } = props;
                        return (
                          <circle cx={cx} cy={cy} r={8} fill={fill} stroke="#fff" strokeWidth={1} />
                        );
                      }}
                    />
                  )}
                  
                  {currentRiskData.length > 0 && (
                    <Scatter
                      name="Connection"
                      data={[
                        { x: parseFloat(inherentScore), y: parseFloat(inherentScore), z: 0, name: "Inherent", isCurrent: false },
                        { x: parseFloat(inherentScore), y: parseFloat(residualScore), z: 0, name: "Residual", isCurrent: false }
                      ]}
                      line={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '4 4' }}
                      fill="none"
                      legendType="none"
                    />
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-md border bg-green-50">
              <div className="font-semibold">Very Low Risk Zone</div>
              <div className="text-muted-foreground">Score: 0-2</div>
            </div>
            <div className="p-2 rounded-md border bg-green-50">
              <div className="font-semibold">Low Risk Zone</div>
              <div className="text-muted-foreground">Score: 2-3</div>
            </div>
            <div className="p-2 rounded-md border bg-orange-50">
              <div className="font-semibold">Medium Risk Zone</div>
              <div className="text-muted-foreground">Score: 3-4</div>
            </div>
            <div className="p-2 rounded-md border bg-red-50">
              <div className="font-semibold">High Risk Zone</div>
              <div className="text-muted-foreground">Score: 4-5</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskHeatMapVisualizer;
