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
      <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm font-medium text-green-700">
          All sections completed! Ready to submit.
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-green-600 font-semibold">{overallProgress}%</div>
          <div className="w-24 h-2 bg-green-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const isCurrentSection = activeTab === nextRequiredSection;
  const sectionLabel = nextRequiredSection ? TAB_LABELS[nextRequiredSection] : "";

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 animate-fade-in",
      isCurrentSection 
        ? "bg-blue-50 border border-blue-200" 
        : "bg-amber-50 border border-amber-200"
    )}>
      <div className={cn(
        "flex items-center justify-center w-6 h-6 rounded-full",
        isCurrentSection ? "bg-blue-500" : "bg-amber-500"
      )}>
        <ArrowRight className="h-3.5 w-3.5 text-white" />
      </div>
      
      <div className="flex flex-col">
        <span className={cn(
          "text-xs font-medium",
          isCurrentSection ? "text-blue-600" : "text-amber-600"
        )}>
          {isCurrentSection ? "Currently Working On" : "Next Required Section"}
        </span>
        <span className={cn(
          "text-sm font-semibold",
          isCurrentSection ? "text-blue-800" : "text-amber-800"
        )}>
          {sectionLabel}
        </span>
      </div>

      {!isCurrentSection && nextRequiredSection && (
        <button
          onClick={() => onNavigate(nextRequiredSection)}
          className="ml-auto px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
        >
          Go to Section
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className={cn(
          "text-xs font-semibold",
          isCurrentSection ? "text-blue-600" : "text-amber-600"
        )}>
          {overallProgress}%
        </div>
        <div className={cn(
          "w-24 h-2 rounded-full overflow-hidden",
          isCurrentSection ? "bg-blue-200" : "bg-amber-200"
        )}>
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isCurrentSection ? "bg-blue-500" : "bg-amber-500"
            )}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default NextSectionCallout;
