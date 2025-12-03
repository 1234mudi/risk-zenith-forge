import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";
import ReviewActionDialog from "./review/ReviewActionDialog";
import { useForm } from "@/contexts/FormContext";

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
  const { formState, approveAssessment, challengeAssessment } = useForm();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  const isLastTab = activeTab === "comments";
  const isFirstTab = activeTab === "general";
  const isApproved = formState.rcsaStatus === "Approved/Finalized";
  const canReview = formState.rcsaStatus === "Pending Review" || formState.rcsaStatus === "Returned for Rework/Challenged";

  return (
    <>
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
          {/* Review Action - Only show for reviewers when not approved */}
          {canReview && (
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => setReviewDialogOpen(true)}
              className="flex items-center h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Shield className="h-3.5 w-3.5" />
              Review
            </Button>
          )}
          
          {isLastTab && !isApproved && (
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

      <ReviewActionDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onApprove={approveAssessment}
        onChallenge={challengeAssessment}
        riskName={formState.risk}
      />
    </>
  );
};

export default RiskAssessmentFooter;
