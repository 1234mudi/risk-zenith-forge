import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormProgress, TAB_ORDER, TAB_LABELS, SectionStatus } from "@/hooks/useFormProgress";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { cn } from "@/lib/utils";
import { Check, Users, ChevronRight } from "lucide-react";

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

  const getProgressBarColor = (status: SectionStatus) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-amber-500";
      default: return "bg-slate-300";
    }
  };

  return (
    <TabsList className="w-full justify-start px-4 py-2 bg-white border-b h-auto overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent gap-1">
      {tabs.map((tab) => {
        const collabKey = sectionToCollabKey[tab.value];
        const sectionCollab = collaborationState[collabKey as keyof typeof collaborationState];
        const hasCollaborators = sectionCollab && sectionCollab.collaborators.length > 0;

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative flex flex-col items-start gap-1 px-3 py-2 rounded-md transition-all duration-200",
              "data-[state=active]:bg-slate-100 data-[state=active]:shadow-sm",
              "data-[state=inactive]:bg-transparent hover:bg-slate-50",
              tab.isNextRequired && "data-[state=inactive]:bg-amber-50 ring-1 ring-amber-400"
            )}
          >
            {/* Step indicator dot */}
            <div className={cn(
              "absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center transition-all",
              tab.progress.status === "completed" 
                ? "bg-green-500" 
                : tab.progress.status === "in-progress"
                  ? "bg-amber-500"
                  : "bg-slate-200"
            )}>
              {tab.progress.status === "completed" ? (
                <Check className="w-2.5 h-2.5 text-white" />
              ) : tab.isNextRequired ? (
                <ChevronRight className="w-2.5 h-2.5 text-amber-700" />
              ) : (
                <span className="text-[8px] font-bold text-slate-500">{tab.index + 1}</span>
              )}
            </div>

            {/* Label with collaborator icon */}
            <div className="flex items-center gap-1 pr-5">
              <span className="text-xs font-medium whitespace-nowrap">
                {tab.label}
              </span>
              {hasCollaborators && (
                <Users className="h-3 w-3 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  getProgressBarColor(tab.progress.status)
                )}
                style={{ width: `${tab.progress.status === "completed" ? 100 : tab.progress.percentage}%` }}
              />
            </div>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default RiskAssessmentNavigation;
