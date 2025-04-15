
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AssessmentGuidanceProps {
  scope: string;
  instructions: string;
  onScopeChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
}

const AssessmentGuidance = ({ 
  scope, 
  instructions, 
  onScopeChange, 
  onInstructionsChange 
}: AssessmentGuidanceProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Label htmlFor="scope" className="text-slate-700">Scope</Label>
        <Textarea
          id="scope"
          value={scope}
          onChange={(e) => onScopeChange(e.target.value)}
          className="mt-1 min-h-[100px]"
          placeholder="Define the scope of this risk assessment..."
        />
      </div>
      
      <div>
        <Label htmlFor="instructions" className="text-slate-700">Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          className="mt-1 min-h-[100px]"
          placeholder="Provide detailed instructions for assessors..."
        />
      </div>
    </div>
  );
};

export default AssessmentGuidance;
