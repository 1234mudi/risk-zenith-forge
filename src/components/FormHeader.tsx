
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
            <span className="text-gray-500">Reference:</span> {formState.referenceId}
            <span className="mx-2">•</span>
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
        
        <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
          {!isWithinAppetite ? (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-md border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm font-medium">Outside Risk Appetite</div>
                <div className="text-xs">Remediation required</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">Within Risk Appetite</div>
                <div className="text-xs">No action required</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Workflow buttons */}
      <div className="flex items-center gap-2 justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleSave}>
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
                  <Button>
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
              <Button variant="ghost" onClick={handleClose}>
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
