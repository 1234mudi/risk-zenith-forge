
import React, { useState } from "react";
import { useForm } from "@/contexts/FormContext";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { Shield, AlertTriangle, CheckCircle2, Save, Send, X, ChevronDown, AlertCircle, Users, MessageSquare, Eye, FileDown, Loader2 } from "lucide-react";
import { CollaborationModal } from "@/components/CollaborationModal";
import ChatPanel from "@/components/panels/ChatPanel";
import ReviewStatusBadge from "@/components/review/ReviewStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useExportPPT } from "@/hooks/useExportPPT";
import { cn } from "@/lib/utils";

const FormHeader = () => {
  const { formState } = useForm();
  const { collaborationState } = useCollaboration();
  const { toast } = useToast();
  const { setActiveTab } = useRiskAssessment();
  const { exportToPPT, isExporting } = useExportPPT();
  const isWithinAppetite = formState.isWithinAppetite;
  const [collaborationModalOpen, setCollaborationModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleExport = () => {
    exportToPPT({
      risk: formState.risk,
      eraId: formState.eraId,
      assessmentId: formState.assessmentId,
      assessmentDate: formState.assessmentDate,
      inherentScore: formState.inherentRatingScore,
      controlScore: formState.controlEffectivenessScore,
      residualScore: formState.residualRatingScore,
      riskAppetite: formState.riskAppetite.level,
      isWithinAppetite: formState.isWithinAppetite,
      riskHierarchy: formState.riskHierarchy,
    });
  };

  // Aggregate all unique collaborators across all sections
  const getAllCollaborators = () => {
    const allCollaborators = new Map();
    const allActiveEditors = new Set<string>();
    
    Object.values(collaborationState).forEach((section) => {
      if (section && section.collaborators) {
        section.collaborators.forEach((collab) => {
          if (!allCollaborators.has(collab.id)) {
            allCollaborators.set(collab.id, collab);
          }
        });
        section.activeEditors?.forEach((id) => allActiveEditors.add(id));
      }
    });
    
    return {
      collaborators: Array.from(allCollaborators.values()),
      activeEditors: Array.from(allActiveEditors)
    };
  };

  const { collaborators, activeEditors } = getAllCollaborators();
  const hasCollaborators = collaborators.length > 0;
  const activeCount = activeEditors.length;
  const viewerCount = collaborators.length - activeCount;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };
  
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
      {/* Action Buttons Bar */}
      <div className="bg-blue-900 p-2.5 rounded-md flex items-center justify-between gap-2">
        {/* Left side - Collaboration info */}
        <div className="flex items-center gap-3">
          {hasCollaborators && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 4).map((collab, idx) => {
                  const isActive = activeEditors.includes(collab.id);
                  return (
                    <TooltipProvider key={collab.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative" style={{ animationDelay: `${idx * 50}ms` }}>
                            <Avatar 
                              className={cn(
                                "h-7 w-7 border-2 border-blue-900 ring-2 transition-all duration-200",
                                isActive 
                                  ? "ring-green-400 shadow-lg shadow-green-500/30" 
                                  : "ring-white/40"
                              )}
                            >
                              <AvatarFallback className={cn(
                                "text-xs font-semibold",
                                isActive 
                                  ? "bg-green-100 text-green-700" 
                                  : "bg-blue-100 text-blue-700"
                              )}>
                                {getInitials(collab.name)}
                              </AvatarFallback>
                            </Avatar>
                            {isActive && (
                              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-green-400 border-2 border-blue-900 rounded-full animate-pulse" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-semibold">{collab.name}</p>
                            <p className="text-muted-foreground">{collab.role}</p>
                            {isActive && (
                              <p className="text-green-600 mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full" />
                                Editing now
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                {collaborators.length > 4 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-7 w-7 rounded-full bg-white/20 border-2 border-blue-900 ring-2 ring-white/40 flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            +{collaborators.length - 4}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{collaborators.length - 4} more collaborators</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {activeCount > 0 && (
                <Badge 
                  variant="outline" 
                  className="h-6 px-2 gap-1 bg-green-500/20 text-green-300 border-green-400/50"
                >
                  <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-medium">{activeCount} editing</span>
                </Badge>
              )}

              {viewerCount > 0 && (
                <Badge 
                  variant="outline" 
                  className="h-6 px-2 gap-1 bg-white/10 text-white/80 border-white/30"
                >
                  <Eye className="h-3 w-3" />
                  <span className="text-xs font-medium">{viewerCount} viewing</span>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="h-8 px-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 text-xs"
            onClick={() => setChatOpen(true)}
          >
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Chat
          </Button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  ) : (
                    <FileDown className="h-3.5 w-3.5 mr-1" />
                  )}
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Summarize & Export to PowerPoint</TooltipContent>
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
              <TooltipContent>Manage collaborators</TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
                  <X className="h-3.5 w-3.5" />
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
            <ReviewStatusBadge status={formState.rcsaStatus} />
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

      <ChatPanel 
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </div>
  );
};

export default FormHeader;
