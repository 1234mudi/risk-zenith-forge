
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown, BarChart2 } from "lucide-react";

const mockOutlierData = [
  { name: "Trading Portfolio Value at Risk (VaR)", value: 3420, threshold: 3000, type: "above", percentDiff: 14, definition: "Trading portfolio risk exposure exceeding historical averages" },
  { name: "Operational Loss Event Frequency", value: 4.2, threshold: 3.0, type: "above", percentDiff: 40, definition: "Higher than expected frequency of operational risk events" },
  { name: "Credit Risk Default Rate", value: 1.2, threshold: 2.0, type: "below", percentDiff: 40, definition: "Lower than expected credit default incidents" },
  { name: "Regulatory Capital Adequacy", value: 82, threshold: 90, type: "below", percentDiff: 9, definition: "Capital ratio below regulatory requirements" },
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
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 gap-1 ml-2">
            <AlertTriangle className="h-3 w-3" /> {aboveThresholdCount + belowThresholdCount} outliers identified
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex justify-between text-xs mb-2">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-50 text-red-700 gap-1">
              <TrendingUp className="h-3 w-3" /> {aboveThresholdCount} above threshold
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 gap-1">
              <TrendingDown className="h-3 w-3" /> {belowThresholdCount} below threshold
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {mockOutlierData.map((metric, index) => (
            <div key={index} className="border rounded-md p-3 bg-slate-50 relative">
              <div className="flex justify-between mb-2">
                <div className="text-sm font-medium text-slate-800">{metric.name}</div>
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
              
              <div className="text-xs text-slate-600 mb-2">
                {metric.definition}
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
