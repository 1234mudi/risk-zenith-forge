import React, { useState } from "react";
import { History, Scale, Target, Shield, Clipboard, BarChart3, FileText, MessageSquareWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import PreviousAssessmentsSection from "@/components/PreviousAssessmentsSection";
import TreatmentSection from "@/components/TreatmentSection";
import MetricsAndLossesSection from "@/components/MetricsAndLossesSection";
import CommentsAttachmentsSection from "@/components/CommentsAttachmentsSection";
import { getScoreColor, getScoreLabel } from "@/utils/rating-utils";
import { getRatingColor } from "@/utils/control-utils";
import { FactorType, Control } from "@/types/control-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from "@/contexts/FormContext";
import { useAssessmentNavigation } from "@/contexts/AssessmentNavigationContext";

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

type PanelTab = "assessments" | "review" | "treatment" | "metrics" | "details";

interface TabConfig {
  id: PanelTab;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: "assessments", label: "Previous Assessments", icon: <History className="h-4 w-4" /> },
  { id: "review", label: "Review & Challenge", icon: <MessageSquareWarning className="h-4 w-4" /> },
  { id: "treatment", label: "Treatment", icon: <Clipboard className="h-4 w-4" /> },
  { id: "metrics", label: "Metrics & Losses", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "details", label: "Additional Details", icon: <FileText className="h-4 w-4" /> },
];

const RightSidePanel = () => {
  const [activeTab, setActiveTab] = useState<PanelTab | null>(null);
  const { formState } = useForm();
  const { activeTab: activeFormSection } = useAssessmentNavigation();

  const handleTabClick = (tabId: PanelTab) => {
    if (activeTab === tabId) {
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
    }
  };

  const getAssessmentTitle = () => {
    switch (activeFormSection) {
      case "inherent":
        return "Previous Inherent Risk Assessments";
      case "control":
        return "Previous Control Effectiveness";
      case "residual":
        return "Previous Residual Risk";
      default:
        return "Previous Assessments";
    }
  };

  const getAssessmentIcon = () => {
    switch (activeFormSection) {
      case "inherent":
        return <Scale className="h-4 w-4 text-amber-600" />;
      case "control":
        return <Shield className="h-4 w-4 text-green-600" />;
      case "residual":
        return <Target className="h-4 w-4 text-blue-600" />;
      default:
        return <History className="h-4 w-4 text-slate-600" />;
    }
  };

  const renderAssessmentsContent = () => {
    // Show section-specific history based on active form section
    switch (activeFormSection) {
      case "inherent":
        return (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              {getAssessmentIcon()}
              {getAssessmentTitle()}
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
        );
      case "control":
        return (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              {getAssessmentIcon()}
              {getAssessmentTitle()}
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
        );
      case "residual":
        return (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              {getAssessmentIcon()}
              {getAssessmentTitle()}
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
        );
      default:
        // For heatmap and issues, show a message
        return (
          <div className="text-center py-8 text-slate-500">
            <History className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No Historical Data</p>
            <p className="text-xs mt-1">Select Inherent Rating, Control Effectiveness, or Residual Rating to view historical assessments</p>
          </div>
        );
    }
  };

  const renderReviewContent = () => {
    const challenge = formState.challengeDetails;
    
    return (
      <div className="space-y-4">
        {challenge ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                  Challenge Active
                </Badge>
              </div>
              <p className="text-sm text-amber-800">{challenge.justification}</p>
              <p className="text-xs text-amber-600 mt-2">
                By {challenge.reviewer} • {challenge.date.toLocaleDateString()}
              </p>
            </div>
            
            {challenge.reasons && challenge.reasons.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-600 mb-2">Challenged Sections</h4>
                <div className="flex flex-wrap gap-1">
                  {challenge.reasons.map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <MessageSquareWarning className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No Active Challenges</p>
            <p className="text-xs mt-1">This assessment has not been challenged</p>
          </div>
        )}
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Comment Activity</h4>
          <div className="text-sm text-slate-500">
            <p>View and manage comments through the Activity panel in the header.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "assessments":
        return renderAssessmentsContent();
      case "review":
        return renderReviewContent();
      case "treatment":
        return <TreatmentSection onNext={() => {}} />;
      case "metrics":
        return <MetricsAndLossesSection />;
      case "details":
        return <CommentsAttachmentsSection />;
      default:
        return null;
    }
  };

  const isExpanded = activeTab !== null;

  return (
    <div className="fixed right-0 top-[140px] bottom-0 flex z-30">
      {/* Expanded Panel Content */}
      {isExpanded && (
        <div className="w-[380px] bg-white border-l border-slate-200 shadow-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 text-sm">
              {activeTab === "assessments" ? getAssessmentTitle() : TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => setActiveTab(null)}
            >
              ×
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            {renderContent()}
          </ScrollArea>
        </div>
      )}
      
      {/* Vertical Tab Strip */}
      <div className="w-11 bg-white border-l border-slate-200 flex flex-col items-center pt-2 gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "w-9 py-3 flex flex-col items-center justify-center rounded-l-md transition-all duration-200",
              "hover:bg-slate-100",
              activeTab === tab.id
                ? "bg-slate-100 text-primary border-r-2 border-primary"
                : "text-slate-500"
            )}
            title={tab.label}
          >
            {tab.icon}
            <span 
              className="text-[8px] font-medium mt-1.5 leading-tight text-center px-0.5"
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