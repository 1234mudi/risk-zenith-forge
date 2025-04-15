
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
    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
      <div>
        <h3 className="font-medium text-slate-700">Overall Residual Risk Rating</h3>
        <p className="text-sm text-slate-500">Calculated based on weighted impact factors</p>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTrendChart(!showTrendChart)}
          className="flex items-center gap-1"
        >
          <LineChart className="h-4 w-4" />
          {showTrendChart ? "Hide Residual Trend" : "Show Residual Trend"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleWeights}
          className="flex items-center gap-1"
        >
          {localShowWeights ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {localShowWeights ? "Hide Weights" : "Show Weights"}
        </Button>
        <div className={`px-4 py-2 rounded border ${getScoreColor(overallScore)}`}>
          <div className="text-sm font-medium">Score: {overallScore}</div>
          <div className="text-xs font-semibold">{getScoreLabel(overallScore)}</div>
        </div>
      </div>
    </div>
  );
};

export default ResidualRatingHeader;
