
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import PreviousAssessmentsSection from "./PreviousAssessmentsSection";
import ResidualRatingHeader from "./residual/ResidualRatingHeader";
import ResidualFactorsTable from "./residual/ResidualFactorsTable";
import { useResidualRating, SAMPLE_HISTORICAL_ASSESSMENTS } from "@/hooks/useResidualRating";
import { getScoreColor, getScoreLabel, getCellColor } from "@/utils/rating-utils";
import { getRatingColor } from "@/utils/control-utils";
import { FactorType } from "@/types/control-types";

type ResidualRatingSectionProps = {
  onNext: () => void;
  showWeights: boolean;
};

const ResidualRatingSection = ({ onNext, showWeights }: ResidualRatingSectionProps) => {
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

  const assessmentHistory = SAMPLE_HISTORICAL_ASSESSMENTS.map(assessment => ({
    date: assessment.date,
    score: assessment.score
  }));

  return (
    <div className="space-y-6">
      <PreviousAssessmentsSection
        title="Previous Residual Risk Assessments"
        assessmentHistory={assessmentHistory}
        factors={SAMPLE_HISTORICAL_ASSESSMENTS[0]?.factors.map(factor => ({
          ...factor,
          type: factor.type as FactorType
        }))}
        showWeights={localShowWeights}
        onCopyLatest={copyFromPrevious}
        getScoreColor={getScoreColor}
        getScoreLabel={getScoreLabel}
        getRatingColor={getRatingColor}
        type="residual"
      />
      
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
        <Card className="p-4 border">
          <div className="h-64 flex items-center justify-center border rounded">
            <LineChart className="h-6 w-6 text-slate-300" />
            <span className="ml-2 text-slate-500">Residual Risk Trend Chart Placeholder</span>
          </div>
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
        <Button onClick={onNext}>Continue to Treatment</Button>
      </div>
    </div>
  );
};

export default ResidualRatingSection;
