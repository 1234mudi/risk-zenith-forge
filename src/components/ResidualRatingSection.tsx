
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, AlertCircle } from "lucide-react";
import PreviousAssessmentsSection from "./PreviousAssessmentsSection";
import ResidualRatingHeader from "./residual/ResidualRatingHeader";
import ResidualFactorsTable from "./residual/ResidualFactorsTable";
import { useResidualRating, SAMPLE_HISTORICAL_ASSESSMENTS } from "@/hooks/useResidualRating";
import { getScoreColor, getScoreLabel, getCellColor } from "@/utils/rating-utils";
import { getRatingColor } from "@/utils/control-utils";
import { FactorType } from "@/types/control-types";
import RiskTrendChart from "./charts/RiskTrendChart";
import { useAIAutofill } from "@/hooks/useAIAutofill";
import { useFormProgress } from "@/hooks/useFormProgress";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ResidualRatingSectionProps = {
  onNext: () => void;
  showWeights: boolean;
};

const ResidualRatingSection = ({ onNext, showWeights }: ResidualRatingSectionProps) => {
  const progress = useFormProgress();
  const isUnlocked = progress.inherent.percentage === 100 && progress.control.percentage === 100;

  const {
    factors,
    overallScore,
    localShowWeights,
    showTrendChart,
    setShowTrendChart,
    handleAddFactor,
    handleRemoveFactor,
    handleFactorChange,
    copyFromPrevious,
    toggleWeights,
  } = useResidualRating({ showWeights });

  // Update historical assessments to show variation in scores
  const modifiedHistoricalAssessments = [
    { ...SAMPLE_HISTORICAL_ASSESSMENTS[0], date: "2024-03-15", score: "3.7" },
    { ...SAMPLE_HISTORICAL_ASSESSMENTS[1], date: "2023-12-10", score: "3.2" },
    { ...SAMPLE_HISTORICAL_ASSESSMENTS[2], date: "2023-09-05", score: "3.5" },
    { ...SAMPLE_HISTORICAL_ASSESSMENTS[3], date: "2023-06-20", score: "3.9" },
    { ...SAMPLE_HISTORICAL_ASSESSMENTS[4], date: "2023-03-12", score: "2.8" },
  ];

  const assessmentHistory = modifiedHistoricalAssessments.map(assessment => ({
    date: assessment.date,
    score: assessment.score
  }));

  if (!isUnlocked) {
    return (
      <div className="space-y-4">
        <Card className="p-8 border-dashed border-2 border-muted-foreground/30 bg-muted/20">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Residual Rating Locked</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Complete the Inherent Risk Rating and Control Effectiveness sections to unlock this section.
              </p>
            </div>
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <div className="flex flex-col gap-1">
                  <span>Inherent Risk: {progress.inherent.percentage}% complete</span>
                  <span>Control Effectiveness: {progress.control.percentage}% complete</span>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ResidualRatingHeader
        overallScore={overallScore}
        showTrendChart={showTrendChart}
        setShowTrendChart={setShowTrendChart}
        localShowWeights={localShowWeights}
        toggleWeights={toggleWeights}
        getScoreColor={getScoreColor}
        getScoreLabel={getScoreLabel}
      />
      
      {showTrendChart && (
        <Card className="p-3 border">
          <RiskTrendChart 
            assessments={assessmentHistory} 
            color="#22c55e" // Green color for residual risk
            title="Residual Risk Score"
          />
        </Card>
      )}
      
      <ResidualFactorsTable
        factors={factors}
        localShowWeights={localShowWeights}
        handleAddFactor={handleAddFactor}
        handleRemoveFactor={handleRemoveFactor}
        handleFactorChange={handleFactorChange}
        getCellColor={getCellColor}
      />
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Heat Map</Button>
      </div>
    </div>
  );
};

export default ResidualRatingSection;
