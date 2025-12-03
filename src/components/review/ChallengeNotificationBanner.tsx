import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export interface ChallengeDetails {
  reviewer: string;
  date: Date;
  reasons: string[];
  justification: string;
}

interface ChallengeNotificationBannerProps {
  challenge: ChallengeDetails | null;
  onDismiss: () => void;
}

const ChallengeNotificationBanner = ({
  challenge,
  onDismiss,
}: ChallengeNotificationBannerProps) => {
  if (!challenge) return null;

  return (
    <Alert className="border-amber-300 bg-amber-50 mb-4">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 flex items-center justify-between">
        <span>Assessment Challenged - Rework Required</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mr-2 hover:bg-amber-100"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <div className="flex items-center gap-4 text-xs text-amber-700">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {challenge.reviewer}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(challenge.date, "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>

        <div>
          <p className="text-xs font-medium text-amber-800 mb-1.5">
            Elements requiring correction:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {challenge.reasons.map((reason, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-amber-100 text-amber-800 border-amber-300"
              >
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded bg-white/60 border border-amber-200">
          <p className="text-xs font-medium text-amber-800 mb-1">
            Reviewer's justification:
          </p>
          <p className="text-sm text-amber-900">{challenge.justification}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ChallengeNotificationBanner;
