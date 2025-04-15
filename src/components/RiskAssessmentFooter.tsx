
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
    <div className="flex justify-between p-5 gap-4 border-t mt-4">
      <Button 
        variant="outline" 
        onClick={onPrevious} 
        className="flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {isFirstTab ? "Previous Risk" : "Previous"}
      </Button>
      
      <div>
        {isLastTab && (
          <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700 mr-2">
            Submit Assessment
          </Button>
        )}
        
        <Button onClick={onNext} className="flex items-center">
          {isLastTab ? "Next Risk" : "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default RiskAssessmentFooter;
