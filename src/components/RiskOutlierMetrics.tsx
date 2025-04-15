
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

const mockOutlierData = [
  { name: "Transaction Volume", value: 3420, threshold: 3000, type: "above", percentDiff: 14 },
  { name: "Error Rate", value: 4.2, threshold: 3.0, type: "above", percentDiff: 40 },
  { name: "Processing Time", value: 1.2, threshold: 2.0, type: "below", percentDiff: 40 },
  { name: "Compliance Score", value: 82, threshold: 90, type: "below", percentDiff: 9 },
];

const RiskOutlierMetrics = () => {
  const aboveThresholdCount = mockOutlierData.filter(m => m.type === "above").length;
  const belowThresholdCount = mockOutlierData.filter(m => m.type === "below").length;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-blue-600" />
          Outlier Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex justify-between text-xs mb-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 gap-1">
            <AlertTriangle className="h-3 w-3" /> {aboveThresholdCount + belowThresholdCount} outliers
          </Badge>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 gap-1">
              <TrendingUp className="h-3 w-3" /> {aboveThresholdCount} above
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 gap-1">
              <TrendingDown className="h-3 w-3" /> {belowThresholdCount} below
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {mockOutlierData.map((metric, index) => (
            <div key={index} className="border rounded-md p-2 bg-slate-50 relative">
              <div className="flex justify-between mb-1">
                <div className="text-xs font-medium text-slate-800">{metric.name}</div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    metric.type === "above" 
                      ? "bg-red-50 text-red-700" 
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {metric.type === "above" ? "Above" : "Below"} threshold
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  {typeof metric.value === 'number' && metric.value % 1 === 0 ? metric.value : metric.value.toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>Threshold: {metric.threshold}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      metric.type === "above" 
                        ? "bg-red-50 text-red-700" 
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {metric.percentDiff}% {metric.type === "above" ? "↑" : "↓"}
                  </Badge>
                </div>
              </div>
              
              <div className="w-full h-1 bg-slate-200 mt-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.type === "above" ? "bg-red-500" : "bg-blue-500"}`}
                  style={{ width: `${Math.min(100, (metric.value / metric.threshold) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskOutlierMetrics;
