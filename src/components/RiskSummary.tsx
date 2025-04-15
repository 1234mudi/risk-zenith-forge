
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RiskSummaryProps = {
  inherentScore: string;
  controlScore: string;
  residualScore: string;
  getScoreColor: (score: string) => string;
  getScoreLabel: (score: string) => string;
};

const RiskSummary = ({
  inherentScore,
  controlScore,
  residualScore,
  getScoreColor,
  getScoreLabel,
}: RiskSummaryProps) => {
  // Determine if residual risk is lower than inherent risk (improvement)
  const hasImprovement = parseFloat(residualScore) < parseFloat(inherentScore);
  const improvementAmount = (parseFloat(inherentScore) - parseFloat(residualScore)).toFixed(1);
  
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-500 mb-1">Inherent Risk</div>
        <div className={`rounded-md px-4 py-2 min-w-24 text-center ${getScoreColor(inherentScore)}`}>
          <div className="font-bold text-lg">{inherentScore}</div>
          <div className="text-xs font-medium">{getScoreLabel(inherentScore)}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-500 mb-1">Control Effectiveness</div>
        <div className={`rounded-md px-4 py-2 min-w-24 text-center ${getScoreColor(controlScore)}`}>
          <div className="font-bold text-lg">{controlScore}</div>
          <div className="text-xs font-medium">{getScoreLabel(controlScore)}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs font-semibold text-gray-500 mb-1">Residual Risk</div>
        <div className={`rounded-md px-4 py-2 min-w-24 text-center ${getScoreColor(residualScore)}`}>
          <div className="font-bold text-lg">{residualScore}</div>
          <div className="text-xs font-medium">{getScoreLabel(residualScore)}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center">
        <div className="text-xs font-semibold text-gray-500 mb-1">Risk Reduction</div>
        <Badge 
          className={`flex items-center gap-1 ${
            hasImprovement 
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-red-100 text-red-800 hover:bg-red-100"
          }`}
        >
          {hasImprovement ? (
            <>
              <ArrowDown className="h-3 w-3" />
              <span>{improvementAmount} points</span>
            </>
          ) : (
            <>
              <ArrowUp className="h-3 w-3" />
              <span>No reduction</span>
            </>
          )}
        </Badge>
      </div>
    </div>
  );
};

export default RiskSummary;
