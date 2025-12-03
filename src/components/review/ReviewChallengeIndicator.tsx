import React from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "@/contexts/FormContext";

interface ReviewChallengeIndicatorProps {
  sectionId: "inherent" | "control" | "residual";
}

// Map challenge reasons to sections
const REASON_TO_SECTION: Record<string, string[]> = {
  "Incorrect risk score assessment": ["inherent"],
  "Overstated control effectiveness rating": ["control"],
  "Missing or incomplete controls": ["control"],
  "Residual risk calculation errors": ["residual"],
  "Insufficient documentation/evidence": ["inherent", "control", "residual"],
  "Assessment methodology not followed": ["inherent", "control", "residual"],
};

export const ReviewChallengeIndicator: React.FC<ReviewChallengeIndicatorProps> = ({
  sectionId,
}) => {
  const { formState } = useForm();
  
  if (formState.rcsaStatus !== "Returned for Rework/Challenged" || !formState.challengeDetails) {
    return null;
  }

  const relevantReasons = formState.challengeDetails.reasons.filter(reason => 
    REASON_TO_SECTION[reason]?.includes(sectionId)
  );

  if (relevantReasons.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className="h-6 px-2 gap-1.5 bg-amber-50 text-amber-700 border-amber-300 animate-pulse cursor-help"
          >
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-medium">Needs Review</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="text-xs space-y-1">
            <p className="font-semibold text-amber-700">Reviewer flagged issues:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {relevantReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const isSectionChallenged = (
  sectionId: "inherent" | "control" | "residual",
  challengeReasons: string[]
): boolean => {
  return challengeReasons.some(reason => 
    REASON_TO_SECTION[reason]?.includes(sectionId)
  );
};

export default ReviewChallengeIndicator;
