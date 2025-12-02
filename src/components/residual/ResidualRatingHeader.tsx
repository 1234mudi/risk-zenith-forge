
import React from "react";
import { Button } from "@/components/ui/button";
import { LineChart, Eye, EyeOff } from "lucide-react";

interface ResidualRatingHeaderProps {
  overallScore: string;
  showTrendChart: boolean;
  setShowTrendChart: (show: boolean) => void;
  localShowWeights: boolean;
  toggleWeights: () => void;
  getScoreColor: (score: string) => string;
  getScoreLabel: (score: string) => string;
}

const ResidualRatingHeader = ({
  overallScore,
  showTrendChart,
  setShowTrendChart,
  localShowWeights,
  toggleWeights,
  getScoreColor,
  getScoreLabel
}: ResidualRatingHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-md border">
      <div>
        <h3 className="font-medium text-slate-700 text-sm">Overall Residual Risk Rating</h3>
        <p className="text-xs text-slate-500">Calculated based on weighted impact factors</p>
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTrendChart(!showTrendChart)}
          className="flex items-center gap-1 h-8 text-xs"
        >
          <LineChart className="h-3.5 w-3.5" />
          {showTrendChart ? "Hide Trend" : "Show Trend"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleWeights}
          className="flex items-center gap-1 h-8 text-xs"
        >
          {localShowWeights ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {localShowWeights ? "Hide Weights" : "Show Weights"}
        </Button>
        <div className={`px-3 py-1.5 rounded border ${getScoreColor(overallScore)}`}>
          <div className="text-xs font-medium">Score: {overallScore}</div>
          <div className="text-[10px] font-semibold">{getScoreLabel(overallScore)}</div>
        </div>
      </div>
    </div>
  );
};

export default ResidualRatingHeader;
