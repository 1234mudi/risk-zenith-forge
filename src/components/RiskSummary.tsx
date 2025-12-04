
import React from "react";
import { ArrowDown, ArrowUp, Lock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFormProgress } from "@/hooks/useFormProgress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type RiskSummaryProps = {
  inherentScore: string;
  controlScore: string;
  residualScore: string;
  getScoreColor: (score: string) => string;
  getScoreLabel: (score: string) => string;
  onInherentClick?: () => void;
  onControlClick?: () => void;
  onResidualClick?: () => void;
};

const RiskSummary = ({
  inherentScore,
  controlScore,
  residualScore,
  getScoreColor,
  getScoreLabel,
  onInherentClick,
  onControlClick,
  onResidualClick,
}: RiskSummaryProps) => {
  const progress = useFormProgress();
  
  // Check if residual section should be unlocked
  const isResidualUnlocked = progress.inherent.percentage === 100 && progress.control.percentage === 100;
  
  // Determine if residual risk is lower than inherent risk (improvement)
  const hasImprovement = parseFloat(residualScore) < parseFloat(inherentScore);
  const improvementAmount = (parseFloat(inherentScore) - parseFloat(residualScore)).toFixed(1);

  const renderProgressIndicator = (percentage: number, isCompleted: boolean) => {
    if (isCompleted) {
      return (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
      );
    }
    return (
      <div className="absolute -top-1 -right-1">
        <ProgressRing percentage={percentage} size={20} strokeWidth={2} />
      </div>
    );
  };
  
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        <div 
          className="flex flex-col items-center cursor-pointer group"
          onClick={onInherentClick}
        >
          <div className="text-xs font-semibold text-muted-foreground mb-1 group-hover:text-primary transition-colors">Inherent Risk</div>
          <div className={`relative rounded-md px-4 py-2 min-w-24 text-center transition-all group-hover:scale-105 group-hover:shadow-md ${getScoreColor(inherentScore)}`}>
            {renderProgressIndicator(progress.inherent.percentage, progress.inherent.percentage === 100)}
            <div className="font-bold text-lg">{inherentScore}</div>
            <div className="text-xs font-medium">{getScoreLabel(inherentScore)}</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30 rounded-b-md overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress.inherent.percentage}%` }}
              />
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{progress.inherent.percentage}% complete</div>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer group"
          onClick={onControlClick}
        >
          <div className="text-xs font-semibold text-muted-foreground mb-1 group-hover:text-primary transition-colors">Control Effectiveness</div>
          <div className={`relative rounded-md px-4 py-2 min-w-24 text-center transition-all group-hover:scale-105 group-hover:shadow-md ${getScoreColor(controlScore)}`}>
            {renderProgressIndicator(progress.control.percentage, progress.control.percentage === 100)}
            <div className="font-bold text-lg">{controlScore}</div>
            <div className="text-xs font-medium">{getScoreLabel(controlScore)}</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30 rounded-b-md overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress.control.percentage}%` }}
              />
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">{progress.control.percentage}% complete</div>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`flex flex-col items-center ${isResidualUnlocked ? 'cursor-pointer group' : 'cursor-not-allowed opacity-60'}`}
              onClick={isResidualUnlocked ? onResidualClick : undefined}
            >
              <div className={`text-xs font-semibold mb-1 transition-colors ${isResidualUnlocked ? 'text-muted-foreground group-hover:text-primary' : 'text-muted-foreground/50'}`}>Residual Risk</div>
              <div className={`relative rounded-md px-4 py-2 min-w-24 text-center transition-all ${isResidualUnlocked ? 'group-hover:scale-105 group-hover:shadow-md' : ''} ${isResidualUnlocked ? getScoreColor(residualScore) : 'bg-muted'}`}>
                {isResidualUnlocked ? (
                  renderProgressIndicator(progress.residual.percentage, progress.residual.percentage === 100)
                ) : (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground/50 flex items-center justify-center">
                    <Lock className="h-3 w-3 text-background" />
                  </div>
                )}
                <div className="font-bold text-lg">{isResidualUnlocked ? residualScore : '--'}</div>
                <div className="text-xs font-medium">{isResidualUnlocked ? getScoreLabel(residualScore) : 'Locked'}</div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30 rounded-b-md overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isResidualUnlocked ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
                    style={{ width: `${isResidualUnlocked ? progress.residual.percentage : 0}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {isResidualUnlocked ? `${progress.residual.percentage}% complete` : 'Complete previous sections'}
              </div>
            </div>
          </TooltipTrigger>
          {!isResidualUnlocked && (
            <TooltipContent>
              <p>Complete Inherent Risk and Control Effectiveness sections first</p>
            </TooltipContent>
          )}
        </Tooltip>
        
        <div className="flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Risk Reduction</div>
          <Badge 
            className={`flex items-center gap-1 ${
              hasImprovement && isResidualUnlocked
                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                : !isResidualUnlocked
                ? "bg-muted text-muted-foreground hover:bg-muted"
                : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {!isResidualUnlocked ? (
              <span>Pending</span>
            ) : hasImprovement ? (
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
    </TooltipProvider>
  );
};

export default RiskSummary;
