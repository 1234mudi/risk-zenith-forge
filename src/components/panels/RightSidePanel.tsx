import React, { useState } from "react";
import { History, Scale, Target, Clipboard, BarChart3, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import PreviousAssessmentsSection from "@/components/PreviousAssessmentsSection";
import TreatmentSection from "@/components/TreatmentSection";
import MetricsAndLossesSection from "@/components/MetricsAndLossesSection";
import CommentsAttachmentsSection from "@/components/CommentsAttachmentsSection";
import { getScoreColor, getScoreLabel } from "@/utils/rating-utils";
import { getRatingColor } from "@/utils/control-utils";
import { FactorType, Control } from "@/types/control-types";

// Sample data for previous assessments
const INHERENT_HISTORICAL = [
  { date: "2024-03-15", score: "3.7", factors: [
    { id: "1", name: "Financial Impact", value: "3", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Reputational Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" },
    { id: "3", name: "Operational Impact", value: "3", weighting: "20", type: "child" as FactorType, comments: "" },
    { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" }
  ]},
  { date: "2023-12-10", score: "3.9", factors: [] },
  { date: "2023-09-05", score: "3.5", factors: [] },
];

const CONTROL_HISTORICAL: { date: string; score: string; controls: Control[] }[] = [
  { date: "2024-03-15", score: "2.3", controls: [
    { id: "1", controlId: "CTL-001", name: "Access Control Management", effectiveness: "3", weighting: "25", designEffect: "effective", operativeEffect: "partially", isKeyControl: true, category: "preventive", comments: "Works well" },
    { id: "2", controlId: "CTL-002", name: "Change Management Process", effectiveness: "2", weighting: "25", designEffect: "highly", operativeEffect: "effective", isKeyControl: false, category: "detective", comments: "Good process" }
  ]},
  { date: "2023-12-10", score: "2.5", controls: [] },
  { date: "2023-09-05", score: "2.8", controls: [] },
];

const RESIDUAL_HISTORICAL = [
  { date: "2024-03-15", score: "3.7", factors: [
    { id: "1", name: "Adjusted Financial Impact", value: "3", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Adjusted Reputational Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" },
  ]},
  { date: "2023-12-10", score: "3.2", factors: [] },
  { date: "2023-09-05", score: "3.5", factors: [] },
];

type PanelTab = "assessments" | "treatment" | "metrics" | "details";

interface TabConfig {
  id: PanelTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: "assessments", label: "Previous Assessments", icon: <History className="h-4 w-4" /> },
  { id: "treatment", label: "Treatment", icon: <Clipboard className="h-4 w-4" /> },
  { id: "metrics", label: "Metrics & Losses", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "details", label: "Additional Details", icon: <FileText className="h-4 w-4" /> },
];

const RightSidePanel = () => {
  const [activeTab, setActiveTab] = useState<PanelTab>("assessments");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTabClick = (tabId: PanelTab) => {
    if (activeTab === tabId && isExpanded) {
      setIsExpanded(false);
    } else {
      setActiveTab(tabId);
      setIsExpanded(true);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "assessments":
        return (
          <div className="space-y-6 p-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-600" />
                Previous Inherent Risk Assessments
              </h3>
              <PreviousAssessmentsSection
                title="Inherent Risk History"
                assessmentHistory={INHERENT_HISTORICAL.map(a => ({ date: a.date, score: a.score }))}
                factors={INHERENT_HISTORICAL[0].factors}
                showWeights={true}
                onCopyLatest={() => {}}
                getScoreColor={getScoreColor}
                getScoreLabel={getScoreLabel}
                getRatingColor={getRatingColor}
                type="inherent"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Previous Control Effectiveness Assessments
              </h3>
              <PreviousAssessmentsSection
                title="Control History"
                assessmentHistory={CONTROL_HISTORICAL.map(a => ({ date: a.date, score: a.score }))}
                controls={CONTROL_HISTORICAL[0].controls}
                showWeights={true}
                onCopyLatest={() => {}}
                getScoreColor={getScoreColor}
                getScoreLabel={getScoreLabel}
                getRatingColor={getRatingColor}
                type="control"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Previous Residual Risk Assessments
              </h3>
              <PreviousAssessmentsSection
                title="Residual Risk History"
                assessmentHistory={RESIDUAL_HISTORICAL.map(a => ({ date: a.date, score: a.score }))}
                factors={RESIDUAL_HISTORICAL[0].factors}
                showWeights={true}
                onCopyLatest={() => {}}
                getScoreColor={getScoreColor}
                getScoreLabel={getScoreLabel}
                getRatingColor={getRatingColor}
                type="residual"
              />
            </div>
          </div>
        );
      case "treatment":
        return (
          <div className="p-4">
            <TreatmentSection onNext={() => {}} />
          </div>
        );
      case "metrics":
        return (
          <div className="p-4">
            <MetricsAndLossesSection />
          </div>
        );
      case "details":
        return (
          <div className="p-4">
            <CommentsAttachmentsSection />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen flex z-40">
      {/* Expanded Panel Content */}
      {isExpanded && (
        <div className="w-96 bg-white border-l shadow-lg h-full overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b bg-slate-50">
              <h2 className="font-semibold text-slate-800">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            <ScrollArea className="flex-1">
              {renderContent()}
            </ScrollArea>
          </div>
        </div>
      )}
      
      {/* Vertical Tab Strip */}
      <div className="w-12 bg-slate-100 border-l flex flex-col items-center py-4 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "w-10 h-24 flex flex-col items-center justify-center rounded-md transition-all",
              "hover:bg-slate-200",
              activeTab === tab.id && isExpanded
                ? "bg-primary text-primary-foreground"
                : "text-slate-600"
            )}
            title={tab.label}
          >
            {tab.icon}
            <span 
              className="text-[9px] font-medium mt-1 writing-mode-vertical whitespace-nowrap"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightSidePanel;