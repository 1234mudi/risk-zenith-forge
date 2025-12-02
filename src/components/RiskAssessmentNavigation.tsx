import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFormProgress, TAB_ORDER, TAB_LABELS, SectionStatus } from "@/hooks/useFormProgress";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { cn } from "@/lib/utils";
import { Check, Clock, AlertCircle, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StatusLabel: React.FC<{ status: SectionStatus }> = ({ status }) => {
  const labels = {
    completed: "Completed",
    "in-progress": "In Progress",
    pending: "Pending"
  };
  
  const colors = {
    completed: "text-green-600 bg-green-50",
    "in-progress": "text-amber-600 bg-amber-50",
    pending: "text-slate-500 bg-slate-50"
  };

  return (
    <span className={cn(
      "text-[10px] font-medium px-1.5 py-0.5 rounded",
      colors[status]
    )}>
      {labels[status]}
    </span>
  );
};

const RiskAssessmentNavigation = () => {
  const progress = useFormProgress();
  const { collaborationState } = useCollaboration();

  const sectionToCollabKey: Record<string, string> = {
    general: "main",
    inherent: "inherent",
    control: "control",
    residual: "residual",
    heatmap: "heatmap",
    treatment: "treatment",
    metrics: "metrics",
    issues: "issues",
    comments: "comments"
  };

  const tabs = TAB_ORDER.map((value, index) => ({
    value,
    label: TAB_LABELS[value],
    progress: progress[value as keyof typeof progress] as { total: number; completed: number; percentage: number; status: SectionStatus; hasCollaborators: boolean },
    isNextRequired: progress.nextRequiredSection === value,
    index
  }));

  return (
    <div className="relative">
      {/* Step Progress Line */}
      <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 z-0">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
          style={{ width: `${progress.overallProgress}%` }}
        />
      </div>

      <TabsList className="relative z-10 w-full justify-start px-6 pt-6 pb-2 bg-white border-b h-auto overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent gap-1">
        {tabs.map((tab) => {
          const collabKey = sectionToCollabKey[tab.value];
          const sectionCollab = collaborationState[collabKey as keyof typeof collaborationState];
          const hasCollaborators = sectionCollab && sectionCollab.collaborators.length > 0;

          return (
            <TooltipProvider key={tab.value}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.value}
                    className={cn(
                      "relative flex flex-col items-start gap-1 px-4 py-3 min-w-[140px] rounded-lg transition-all duration-200",
                      "data-[state=active]:bg-blue-50 data-[state=active]:shadow-sm",
                      tab.isNextRequired && "ring-2 ring-amber-400 ring-offset-1 bg-amber-50/50",
                      tab.progress.status === "completed" && "border-l-4 border-l-green-500",
                      tab.progress.status === "in-progress" && "border-l-4 border-l-amber-500",
                      tab.progress.status === "pending" && "border-l-4 border-l-slate-300"
                    )}
                  >
                    {/* Step Number Circle */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                        tab.progress.status === "completed" 
                          ? "bg-green-500 border-green-500 text-white" 
                          : tab.progress.status === "in-progress"
                            ? "bg-amber-500 border-amber-500 text-white"
                            : tab.isNextRequired
                              ? "bg-amber-100 border-amber-400 text-amber-700"
                              : "bg-white border-slate-300 text-slate-500"
                      )}>
                        {tab.progress.status === "completed" ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          tab.index + 1
                        )}
                      </div>
                    </div>

                    {/* Tab Label with Collaborator Icon */}
                    <div className="flex items-center gap-2 w-full mt-1">
                      <span className={cn(
                        "text-sm font-medium truncate",
                        "group-data-[state=active]:text-blue-700"
                      )}>
                        {tab.label}
                      </span>
                      {hasCollaborators && (
                        <Users className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Status and Progress */}
                    <div className="flex items-center justify-between w-full gap-2">
                      <StatusLabel status={tab.progress.status} />
                      
                      {tab.progress.total > 0 && (
                        <div className="flex items-center gap-1">
                          <ProgressRing 
                            percentage={tab.progress.percentage} 
                            size={16}
                            strokeWidth={2}
                            className="opacity-80"
                          />
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {tab.progress.percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Required Badge */}
                    {tab.isNextRequired && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                        <div className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full whitespace-nowrap animate-pulse">
                          ACTION REQUIRED
                        </div>
                      </div>
                    )}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-xs space-y-1">
                    <p className="font-semibold">{tab.label}</p>
                    <div className="flex items-center gap-2">
                      {tab.progress.status === "completed" && <Check className="h-3.5 w-3.5 text-green-600" />}
                      {tab.progress.status === "in-progress" && <Clock className="h-3.5 w-3.5 text-amber-500" />}
                      {tab.progress.status === "pending" && <AlertCircle className="h-3.5 w-3.5 text-slate-400" />}
                      <span>{tab.progress.completed}/{tab.progress.total} fields completed</span>
                    </div>
                    {hasCollaborators && (
                      <p className="text-blue-600 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {sectionCollab.collaborators.length} collaborator(s) assigned
                      </p>
                    )}
                    {tab.isNextRequired && (
                      <p className="text-amber-600 font-medium">← Complete this section next</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </TabsList>
    </div>
  );
};

export default RiskAssessmentNavigation;
