
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, ReferenceLine, ReferenceArea, ResponsiveContainer } from "recharts";
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
    if (score >= 2) return "#eab308";
    return "#22c55e";
  };

  const getZoneColor = (x: number, y: number, opacity: number = 0.2) => {
    if (x >= 4 && y >= 4) return `rgba(239, 68, 68, ${opacity})`;
    if (x >= 3 && y >= 3) return `rgba(249, 115, 22, ${opacity})`;
    if (x >= 2 && y >= 2) return `rgba(234, 179, 8, ${opacity})`;
    return `rgba(34, 197, 94, ${opacity})`;
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
                <p>This heat map visualizes the inherent risk (X-axis) versus the residual risk (Y-axis). The color zones represent different risk levels, and the appetite threshold line shows your organization's risk tolerance.</p>
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
              <ScatterChart
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Inherent Risk" 
                  domain={[0, 5]} 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Inherent Risk', position: 'insideBottom', offset: -10, fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Residual Risk" 
                  domain={[0, 5]} 
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Residual Risk', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12 }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 500]} />

                {/* Appetite Threshold Lines */}
                <ReferenceLine y={appetiteThreshold} stroke={riskAppetite.color} strokeWidth={2} strokeDasharray="3 3" />
                <ReferenceLine x={appetiteThreshold} stroke={riskAppetite.color} strokeWidth={2} strokeDasharray="3 3" />

                {/* Risk Zones */}
                <ReferenceArea x1={4} x2={5} y1={4} y2={5} fill={getZoneColor(4, 4)} stroke="#ef4444" />
                <ReferenceArea x1={3} x2={4} y1={3} y2={5} fill={getZoneColor(3, 3)} stroke="#f97316" />
                <ReferenceArea x1={4} x2={5} y1={3} y2={4} fill={getZoneColor(3, 3)} stroke="#f97316" />
                <ReferenceArea x1={2} x2={3} y1={2} y2={5} fill={getZoneColor(2, 2)} stroke="#eab308" />
                <ReferenceArea x1={3} x2={5} y1={2} y2={3} fill={getZoneColor(2, 2)} stroke="#eab308" />
                <ReferenceArea x1={0} x2={2} y1={0} y2={5} fill={getZoneColor(1, 1)} stroke="#22c55e" />
                <ReferenceArea x1={2} x2={5} y1={0} y2={2} fill={getZoneColor(1, 1)} stroke="#22c55e" />

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
              </ScatterChart>
            </ChartContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-md border" style={{ backgroundColor: getZoneColor(4, 4, 0.2) }}>
              <div className="font-semibold">High Risk Zone</div>
              <div className="text-muted-foreground">Score: 4-5</div>
            </div>
            <div className="p-2 rounded-md border" style={{ backgroundColor: getZoneColor(3, 3, 0.2) }}>
              <div className="font-semibold">Medium Risk Zone</div>
              <div className="text-muted-foreground">Score: 3-4</div>
            </div>
            <div className="p-2 rounded-md border" style={{ backgroundColor: getZoneColor(2, 2, 0.2) }}>
              <div className="font-semibold">Low Risk Zone</div>
              <div className="text-muted-foreground">Score: 2-3</div>
            </div>
            <div className="p-2 rounded-md border" style={{ backgroundColor: getZoneColor(1, 1, 0.2) }}>
              <div className="font-semibold">Very Low Risk Zone</div>
              <div className="text-muted-foreground">Score: 0-2</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskHeatMapVisualizer;
