
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RiskAssessmentFooterProps {
  activeTab: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const RiskAssessmentFooter = ({
  activeTab,
  onPrevious,
  onNext,
  onSubmit
}: RiskAssessmentFooterProps) => {
  const isLastTab = activeTab === "comments";
  const isFirstTab = activeTab === "general";

  return (
    <div className="flex justify-between p-3 gap-3 border-t mt-3">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onPrevious} 
        className="flex items-center h-8 text-xs"
      >
        <ChevronLeft className="h-3.5 w-3.5 mr-0.5" />
        {isFirstTab ? "Previous Risk" : "Previous"}
      </Button>
      
      <div className="flex gap-2">
        {isLastTab && (
          <Button onClick={onSubmit} size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs">
            Submit Assessment
          </Button>
        )}
        
        <Button onClick={onNext} size="sm" className="flex items-center h-8 text-xs">
          {isLastTab ? "Next Risk" : "Next"}
          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default RiskAssessmentFooter;
