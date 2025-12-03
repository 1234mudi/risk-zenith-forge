
import React, { useState } from "react";
import { useForm } from "@/contexts/FormContext";
import { Shield, AlertTriangle, CheckCircle2, Save, Send, X, ChevronDown, AlertCircle, Users, MessageSquare, Activity } from "lucide-react";
import { CollaborationModal } from "@/components/CollaborationModal";
import TeamActivityPanel from "@/components/panels/TeamActivityPanel";
import ChatPanel from "@/components/panels/ChatPanel";
import CommentActivityPanel from "@/components/collaboration/CommentActivityPanel";
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
import { useRiskAssessment } from "@/hooks/useRiskAssessment";

const FormHeader = () => {
  const { formState } = useForm();
  const { toast } = useToast();
  const { setActiveTab } = useRiskAssessment();
  const isWithinAppetite = formState.isWithinAppetite;
  const [collaborationModalOpen, setCollaborationModalOpen] = useState(false);
  const [teamActivityOpen, setTeamActivityOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };
  
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
    <div className="space-y-3">
      {/* Action Buttons Bar - Moved to Top */}
      <div className="bg-blue-900 p-2.5 rounded-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs"
            onClick={() => setTeamActivityOpen(true)}
          >
            <Activity className="h-4 w-4 mr-1.5" />
            Team Activity
          </Button>

          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs"
            onClick={() => setChatOpen(true)}
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Chat
          </Button>

          <CommentActivityPanel />
        </div>

        <div className="flex items-center gap-2">

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="sm" onClick={handleSave} className="h-8 text-xs">
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save the current assessment</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm"
                className="h-8 text-xs bg-[hsl(var(--collaborate))] hover:bg-[hsl(var(--collaborate))]/90 text-[hsl(var(--collaborate-foreground))]"
                onClick={() => setCollaborationModalOpen(true)}
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                Collaborate
              </Button>
            </TooltipTrigger>
            <TooltipContent>Manage collaborators and section access</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="h-8 text-xs bg-green-700 hover:bg-green-800">
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Submit
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
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
              <Button variant="secondary" size="sm" onClick={handleClose} className="h-8 text-xs">
                <X className="h-3.5 w-3.5 mr-1" />
                Close
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close this assessment</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </div>
      </div>


      {/* Risk Information */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Assess Risk: {formState.risk}</span>
            <Badge 
              variant="outline" 
              className="ml-2 text-xs font-normal cursor-pointer hover:bg-accent transition-colors"
              onClick={() => copyToClipboard(formState.eraId, "ERA ID")}
            >
              {formState.eraId}
            </Badge>
          </h2>
          <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
            <span className="text-gray-500">Assessment ID:</span> 
            <span 
              className="cursor-pointer hover:text-blue-600 transition-colors underline decoration-dotted"
              onClick={() => copyToClipboard(formState.assessmentId, "Assessment ID")}
            >
              {formState.assessmentId}
            </span>
            <span className="mx-2">•</span>
            <span className="text-gray-500">Date:</span> {formState.assessmentDate}
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-[10px] text-gray-500 mr-1.5">Risk Hierarchy:</span>
              <Badge 
                variant="secondary" 
                className="font-normal text-[10px] cursor-pointer hover:bg-secondary/80 transition-colors"
                onClick={() => copyToClipboard(formState.riskHierarchy, "Risk Hierarchy")}
              >
                {formState.riskHierarchy}
              </Badge>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-500">Risk Appetite:</span>
              <Badge 
                className="font-normal text-[10px]"
                style={{ backgroundColor: formState.riskAppetite.color, color: 'white' }}
              >
                {formState.riskAppetite.level}
              </Badge>
              <Badge variant="outline" className={`font-mono text-[10px] ${
                !isWithinAppetite ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
              }`}>
                {isWithinAppetite ? (
                  <span className="flex items-center gap-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    Within Appetite
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    Outside Appetite
                  </span>
                )}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{formState.riskAppetite.description}</p>
                    <p className="mt-1">Threshold: {formState.riskAppetite.threshold}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <RiskSummary 
          inherentScore={formState.inherentRatingScore} 
          controlScore={formState.controlEffectivenessScore}
          residualScore={formState.residualRatingScore}
          onInherentClick={() => {
            setActiveTab("inherent");
            toast({
              title: "Navigated to Inherent Risk",
              description: "View and edit inherent risk factors"
            });
          }}
          onControlClick={() => {
            setActiveTab("control");
            toast({
              title: "Navigated to Control Effectiveness",
              description: "View and edit control effectiveness"
            });
          }}
          onResidualClick={() => {
            setActiveTab("residual");
            toast({
              title: "Navigated to Residual Risk",
              description: "View and edit residual risk factors"
            });
          }}
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
          <RelatedRisks />
        </div>
      </div>
      
      <CollaborationModal 
        open={collaborationModalOpen} 
        onOpenChange={setCollaborationModalOpen} 
      />

      <TeamActivityPanel 
        open={teamActivityOpen}
        onOpenChange={setTeamActivityOpen}
      />

      <ChatPanel 
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
};

export default FormHeader;
