import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFormProgress, TAB_ORDER, TAB_LABELS, SectionStatus } from "@/hooks/useFormProgress";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { cn } from "@/lib/utils";
import { Check, Users } from "lucide-react";

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

  const getStatusColor = (status: SectionStatus) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in-progress": return "text-amber-600";
      default: return "text-slate-400";
    }
  };

  const getStatusLabel = (status: SectionStatus) => {
    switch (status) {
      case "completed": return "Completed";
      case "in-progress": return "In Progress";
      default: return "Pending";
    }
  };

  return (
    <TabsList className="w-full justify-start px-4 py-3 bg-white border-b h-auto overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent gap-2">
      {tabs.map((tab) => {
        const collabKey = sectionToCollabKey[tab.value];
        const sectionCollab = collaborationState[collabKey as keyof typeof collaborationState];
        const hasCollaborators = sectionCollab && sectionCollab.collaborators.length > 0;

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative flex flex-col items-center gap-1.5 px-3 py-2 min-w-[100px] max-w-[120px] rounded-lg border transition-all duration-200",
              "data-[state=active]:shadow-md data-[state=active]:border-amber-400 data-[state=active]:bg-amber-50",
              "data-[state=inactive]:border-slate-200 data-[state=inactive]:bg-white hover:bg-slate-50",
              tab.isNextRequired && "data-[state=inactive]:border-amber-300 data-[state=inactive]:bg-amber-50/50"
            )}
          >
            {/* Step Number - Top Right */}
            <div className={cn(
              "absolute -top-2 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
              tab.progress.status === "completed" 
                ? "bg-green-500 text-white" 
                : tab.progress.status === "in-progress" || tab.isNextRequired
                  ? "bg-amber-500 text-white"
                  : "bg-slate-200 text-slate-600 border border-slate-300"
            )}>
              {tab.progress.status === "completed" ? (
                <Check className="w-3 h-3" />
              ) : (
                tab.index + 1
              )}
            </div>

            {/* Label Row */}
            <div className="flex items-center gap-1 w-full justify-center">
              <span className="text-xs font-medium truncate max-w-[80px]">
                {tab.label}
              </span>
              {hasCollaborators && (
                <Users className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* Status Row */}
            <div className="flex items-center gap-1.5 w-full justify-center">
              <span className={cn("text-[10px] font-medium", getStatusColor(tab.progress.status))}>
                {getStatusLabel(tab.progress.status)}
              </span>
              {tab.progress.total > 0 && tab.progress.status !== "completed" && (
                <div className="flex items-center gap-0.5">
                  <ProgressRing 
                    percentage={tab.progress.percentage} 
                    size={14}
                    strokeWidth={2}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {tab.progress.percentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Action Required Badge */}
            {tab.isNextRequired && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded whitespace-nowrap">
                NEXT
              </div>
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default RiskAssessmentNavigation;
