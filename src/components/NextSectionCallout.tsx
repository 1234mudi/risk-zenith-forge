import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useFormProgress, TAB_LABELS } from "@/hooks/useFormProgress";
import { cn } from "@/lib/utils";

interface NextSectionCalloutProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
}

const NextSectionCallout: React.FC<NextSectionCalloutProps> = ({
  activeTab,
  onNavigate
}) => {
  const { nextRequiredSection, overallProgress } = useFormProgress();

  if (!nextRequiredSection && overallProgress === 100) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-md">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <div className="flex-1 h-1.5 bg-green-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full w-full" />
        </div>
      </div>
    );
  }

  const isCurrentSection = activeTab === nextRequiredSection;
  const sectionLabel = nextRequiredSection ? TAB_LABELS[nextRequiredSection] : "";

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-md",
      isCurrentSection ? "bg-blue-50" : "bg-amber-50"
    )}>
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center",
        isCurrentSection ? "bg-blue-500" : "bg-amber-500"
      )}>
        <ArrowRight className="h-3 w-3 text-white" />
      </div>
      
      <span className={cn(
        "text-xs font-medium",
        isCurrentSection ? "text-blue-700" : "text-amber-700"
      )}>
        {sectionLabel}
      </span>

      {!isCurrentSection && nextRequiredSection && (
        <button
          onClick={() => onNavigate(nextRequiredSection)}
          className="px-2 py-0.5 text-[10px] font-medium text-white bg-amber-500 hover:bg-amber-600 rounded transition-colors"
        >
          Go
        </button>
      )}

      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-2">
        <div 
          className={cn(
            "h-full rounded-full transition-all",
            isCurrentSection ? "bg-blue-500" : "bg-amber-500"
          )}
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default NextSectionCallout;
