
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

  return (
    <div className="space-y-6">
      <PreviousAssessmentsSection
        title="Previous Residual Risk Assessments"
        assessmentHistory={assessmentHistory}
        factors={modifiedHistoricalAssessments[0]?.factors.map(factor => ({
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
        <Button onClick={onNext}>Continue to Heat Map</Button>
      </div>
    </div>
  );
};

export default ResidualRatingSection;
