
import React from "react";
import { useForm } from "@/contexts/FormContext";
import { Shield, AlertTriangle, CheckCircle2, Save, Send, X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import RiskSummary from "./RiskSummary";
import RelatedRisks from "./RelatedRisks";

const FormHeader = () => {
  const { formState } = useForm();
  const { toast } = useToast();
  const isWithinAppetite = formState.isWithinAppetite;
  
  const handleSave = () => {
    toast({
      title: "Assessment Saved",
      description: "Your risk assessment has been saved successfully."
    });
  };
  
  const handleClose = () => {
    toast({
      title: "Assessment Closed",
      description: "Returning to risk assessment list."
    });
  };
  
  const handleWorkflowAction = (action: string) => {
    toast({
      title: `Assessment ${action}`,
      description: `Your risk assessment has been ${action.toLowerCase()} successfully.`
    });
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Assess Risk: {formState.risk}</span>
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              {formState.eraId}
            </Badge>
          </h2>
          <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <span className="text-gray-500">Assessment ID:</span> {formState.assessmentId}
            <span className="mx-2">•</span>
            <span className="text-gray-500">Date:</span> {formState.assessmentDate}
          </div>
          <div className="mt-1 flex items-center">
            <span className="text-xs text-gray-500 mr-2">Risk Hierarchy:</span>
            <Badge variant="secondary" className="font-normal text-xs">
              {formState.riskHierarchy}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <RiskSummary 
          inherentScore={formState.inherentRatingScore} 
          controlScore={formState.controlEffectivenessScore}
          residualScore={formState.residualRatingScore}
          getScoreColor={(score) => {
            const numScore = parseFloat(score || "0");
            if (numScore >= 4) return "bg-red-600 text-white border-red-700";
            if (numScore >= 3) return "bg-orange-500 text-white border-orange-600";
            if (numScore >= 2) return "bg-yellow-500 text-white border-yellow-600";
            return "bg-green-500 text-white border-green-600";
          }}
          getScoreLabel={(score) => {
            const numScore = parseFloat(score || "0");
            if (numScore >= 4) return "High";
            if (numScore >= 3) return "Medium";
            if (numScore >= 2) return "Low";
            return "Very Low";
          }}
        />
        
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-40 justify-center"
          >
            <Shield className="h-4 w-4" />
            Show Heat Map
          </Button>
          
          <RelatedRisks />
        </div>
      </div>
      
      <div className="bg-blue-900 p-3 rounded-md flex items-center justify-end gap-2 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save the current assessment</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="bg-green-700 hover:bg-green-800">
                    <Send className="h-4 w-4 mr-1" />
                    Submit
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Submit the assessment</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleWorkflowAction("Sent for Review")}>
              Send for Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleWorkflowAction("Sent for Approval")}>
              Send for Approval
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleWorkflowAction("Reassigned")}>
              Reassign
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" onClick={handleClose}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close this assessment</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default FormHeader;
