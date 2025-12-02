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
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium text-green-700">All sections completed</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-16 h-1.5 bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
          </div>
          <span className="text-[10px] text-green-600 font-semibold">100%</span>
        </div>
      </div>
    );
  }

  const isCurrentSection = activeTab === nextRequiredSection;
  const sectionLabel = nextRequiredSection ? TAB_LABELS[nextRequiredSection] : "";

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
      isCurrentSection ? "bg-blue-50 border border-blue-200" : "bg-amber-50 border border-amber-200"
    )}>
      <div className={cn(
        "flex items-center justify-center w-5 h-5 rounded-full",
        isCurrentSection ? "bg-blue-500" : "bg-amber-500"
      )}>
        <ArrowRight className="h-3 w-3 text-white" />
      </div>
      
      <span className={cn(
        "text-xs",
        isCurrentSection ? "text-blue-600" : "text-amber-600"
      )}>
        {isCurrentSection ? "Working on:" : "Next:"}
      </span>
      <span className={cn(
        "text-xs font-semibold",
        isCurrentSection ? "text-blue-800" : "text-amber-800"
      )}>
        {sectionLabel}
      </span>

      {!isCurrentSection && nextRequiredSection && (
        <button
          onClick={() => onNavigate(nextRequiredSection)}
          className="ml-1 px-2 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded transition-colors"
        >
          Go
        </button>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <div className={cn(
          "w-16 h-1.5 rounded-full overflow-hidden",
          isCurrentSection ? "bg-blue-200" : "bg-amber-200"
        )}>
          <div 
            className={cn("h-full rounded-full transition-all", isCurrentSection ? "bg-blue-500" : "bg-amber-500")}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <span className={cn(
          "text-[10px] font-semibold",
          isCurrentSection ? "text-blue-600" : "text-amber-600"
        )}>
          {overallProgress}%
        </span>
      </div>
    </div>
  );
};

export default NextSectionCallout;
