import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <TabsList className="w-full justify-start px-3 py-1.5 bg-white border-b h-auto overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent gap-0.5">
      {tabs.map((tab) => {
        const collabKey = sectionToCollabKey[tab.value];
        const sectionCollab = collaborationState[collabKey as keyof typeof collaborationState];
        const hasCollaborators = sectionCollab && sectionCollab.collaborators.length > 0;

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative flex flex-col items-start gap-0.5 px-2.5 py-1.5 rounded-md transition-all duration-200 overflow-visible",
              "data-[state=active]:bg-slate-100 data-[state=active]:shadow-sm",
              "data-[state=inactive]:bg-transparent hover:bg-slate-50"
            )}
          >

            {/* Step indicator dot */}
            <div className={cn(
              "absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all",
              tab.progress.status === "completed" 
                ? "bg-green-500" 
                : tab.progress.status === "in-progress"
                  ? "bg-amber-500"
                  : "bg-slate-200"
            )}>
              {tab.progress.status === "completed" ? (
                <Check className="w-2 h-2 text-white" />
              ) : (
                <span className={cn(
                  "text-[7px] font-bold",
                  tab.progress.status === "in-progress" ? "text-white" : "text-slate-500"
                )}>
                  {tab.index + 1}
                </span>
              )}
            </div>

            {/* Label with collaborator icon */}
            <div className="flex items-center gap-0.5 pr-4">
              <span className="text-[11px] font-medium whitespace-nowrap">
                {tab.label}
              </span>
              {hasCollaborators && (
                <Users className="h-2.5 w-2.5 text-blue-500 flex-shrink-0" />
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-0.5 bg-slate-200 rounded-full overflow-hidden">
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
