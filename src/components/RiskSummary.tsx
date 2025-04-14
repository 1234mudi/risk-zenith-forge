
import React from "react";
import { Card } from "@/components/ui/card";

interface RiskSummaryProps {
  inherentScore: string;
  controlScore: string;
  residualScore: string;
  getScoreColor: (score: string) => string;
  getScoreLabel: (score: string) => string;
}

const RiskSummary: React.FC<RiskSummaryProps> = ({
  inherentScore,
  controlScore,
  residualScore,
  getScoreColor,
  getScoreLabel
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center space-x-2">
        <div className="text-sm text-slate-600 font-medium">Summary:</div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Card className="p-2 flex items-center space-x-2 border">
          <div className="text-xs text-slate-500">Inherent:</div>
          <div className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(inherentScore)}`}>
            {inherentScore || '0.0'} - {getScoreLabel(inherentScore)}
          </div>
        </Card>
        
        <Card className="p-2 flex items-center space-x-2 border">
          <div className="text-xs text-slate-500">Control:</div>
          <div className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(controlScore)}`}>
            {controlScore || '0.0'} - {getScoreLabel(controlScore)}
          </div>
        </Card>
        
        <Card className="p-2 flex items-center space-x-2 border">
          <div className="text-xs text-slate-500">Residual:</div>
          <div className={`text-sm font-semibold px-2 py-1 rounded ${getScoreColor(residualScore)}`}>
            {residualScore || '0.0'} - {getScoreLabel(residualScore)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiskSummary;
