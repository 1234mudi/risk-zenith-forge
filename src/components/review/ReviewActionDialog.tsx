import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Send, Shield, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type RCSAStatus = 
  | "Draft" 
  | "Pending Review" 
  | "Approved/Finalized" 
  | "Returned for Rework/Challenged";

interface ChallengeReason {
  id: string;
  label: string;
  checked: boolean;
}

interface ReviewActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onChallenge: (justification: string, reasons: string[]) => void;
  riskName: string;
}

const CHALLENGE_REASONS: ChallengeReason[] = [
  { id: "risk-score", label: "Incorrect risk score assessment", checked: false },
  { id: "control-rating", label: "Overstated control effectiveness rating", checked: false },
  { id: "missing-controls", label: "Missing or incomplete controls", checked: false },
  { id: "residual-calc", label: "Residual risk calculation errors", checked: false },
  { id: "documentation", label: "Insufficient documentation/evidence", checked: false },
  { id: "methodology", label: "Assessment methodology not followed", checked: false },
];

const ReviewActionDialog = ({
  open,
  onOpenChange,
  onApprove,
  onChallenge,
  riskName,
}: ReviewActionDialogProps) => {
  const [action, setAction] = useState<"approve" | "challenge" | null>(null);
  const [challengeReasons, setChallengeReasons] = useState<ChallengeReason[]>(CHALLENGE_REASONS);
  const [justification, setJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedReasons = challengeReasons.filter(r => r.checked);
  const canSubmitChallenge = action === "challenge" && selectedReasons.length > 0 && justification.trim().length >= 20;

  const handleReasonToggle = (id: string) => {
    setChallengeReasons(prev =>
      prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (action === "approve") {
        onApprove();
        toast.success("RCSA Approved", {
          description: "The assessment has been finalized successfully.",
        });
      } else if (action === "challenge") {
        const reasonLabels = selectedReasons.map(r => r.label);
        onChallenge(justification, reasonLabels);
        toast.success("RCSA Challenged", {
          description: "The assessment has been returned to the 1st Line user for rework.",
        });
      }
      
      // Reset state
      setAction(null);
      setChallengeReasons(CHALLENGE_REASONS);
      setJustification("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAction(null);
    setChallengeReasons(CHALLENGE_REASONS);
    setJustification("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Review Assessment
          </DialogTitle>
          <DialogDescription>
            Review the RCSA for <span className="font-medium text-foreground">{riskName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Action Selection */}
          <RadioGroup
            value={action || ""}
            onValueChange={(val) => setAction(val as "approve" | "challenge")}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="approve"
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                action === "approve"
                  ? "border-green-500 bg-green-50"
                  : "border-muted hover:border-green-200 hover:bg-green-50/50"
              )}
            >
              <RadioGroupItem value="approve" id="approve" className="sr-only" />
              <div className={cn(
                "p-2 rounded-full",
                action === "approve" ? "bg-green-500 text-white" : "bg-muted"
              )}>
                <Check className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">Approve</span>
              <span className="text-xs text-muted-foreground text-center">
                Finalize this assessment
              </span>
            </Label>

            <Label
              htmlFor="challenge"
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                action === "challenge"
                  ? "border-amber-500 bg-amber-50"
                  : "border-muted hover:border-amber-200 hover:bg-amber-50/50"
              )}
            >
              <RadioGroupItem value="challenge" id="challenge" className="sr-only" />
              <div className={cn(
                "p-2 rounded-full",
                action === "challenge" ? "bg-amber-500 text-white" : "bg-muted"
              )}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">Challenge</span>
              <span className="text-xs text-muted-foreground text-center">
                Return for rework
              </span>
            </Label>
          </RadioGroup>

          {/* Approve Confirmation */}
          {action === "approve" && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Ready to Approve</p>
                  <p className="text-xs text-green-700 mt-1">
                    Approving will finalize this RCSA and update the status to "Approved/Finalized". 
                    This action will be logged in the audit trail.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Challenge Details */}
          {action === "challenge" && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <FileWarning className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Select the elements that need correction and provide detailed justification. 
                    The assessment will be returned to the 1st Line user.
                  </p>
                </div>
              </div>

              {/* Challenge Reasons */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Elements requiring correction <span className="text-destructive">*</span>
                </Label>
                <div className="grid gap-2">
                  {challengeReasons.map((reason) => (
                    <div
                      key={reason.id}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-md border cursor-pointer transition-colors",
                        reason.checked
                          ? "border-amber-300 bg-amber-50"
                          : "border-muted hover:bg-muted/50"
                      )}
                      onClick={() => handleReasonToggle(reason.id)}
                    >
                      <Checkbox
                        id={reason.id}
                        checked={reason.checked}
                        onCheckedChange={() => handleReasonToggle(reason.id)}
                      />
                      <Label
                        htmlFor={reason.id}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedReasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedReasons.map((reason) => (
                      <Badge
                        key={reason.id}
                        variant="secondary"
                        className="text-xs bg-amber-100 text-amber-800"
                      >
                        {reason.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Justification */}
              <div className="space-y-2">
                <Label htmlFor="justification" className="text-sm font-medium">
                  Detailed justification <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="justification"
                  placeholder="Provide specific details about why this assessment is being challenged and what corrections are needed..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 20 characters required. {justification.length}/20
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {action === "approve" && (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Approve & Finalize
            </Button>
          )}
          {action === "challenge" && (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmitChallenge || isSubmitting}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Send className="h-4 w-4 mr-1.5" />
              Submit Challenge
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewActionDialog;
