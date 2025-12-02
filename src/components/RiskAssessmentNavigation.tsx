import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useFormProgress } from "@/hooks/useFormProgress";

const RiskAssessmentNavigation = () => {
  const progress = useFormProgress();

  const tabs = [
    { value: "general", label: "Details", progress: progress.general },
    { value: "inherent", label: "Inherent Rating", progress: progress.inherent },
    { value: "control", label: "Control Effectiveness", progress: progress.control },
    { value: "residual", label: "Residual Rating", progress: progress.residual },
    { value: "heatmap", label: "Heat Map", progress: progress.heatmap },
    { value: "treatment", label: "Treatment", progress: progress.treatment },
    { value: "metrics", label: "Metrics and Losses", progress: progress.metrics },
    { value: "issues", label: "Issues", progress: progress.issues },
    { value: "comments", label: "Additional Details", progress: progress.comments },
  ];

  return (
    <TabsList className="w-full justify-start px-6 pt-4 bg-white border-b h-auto overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 gap-2 group"
        >
          <span>{tab.label}</span>
          {tab.progress.total > 0 && (
            <div className="relative">
              <ProgressRing 
                percentage={tab.progress.percentage} 
                size={18}
                strokeWidth={2}
                className="opacity-70 group-data-[state=active]:opacity-100"
              />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold transform rotate-90">
                {tab.progress.percentage}
              </span>
            </div>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default RiskAssessmentNavigation;
