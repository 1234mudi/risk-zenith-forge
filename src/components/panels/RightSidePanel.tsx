import React, { useState } from "react";
import { History, Scale, Target, Shield, Clipboard, BarChart3, FileText, MessageSquareWarning, Clock, Info, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Sample data for previous assessments
const INHERENT_HISTORICAL = [
  { date: "2024-03-15", score: "3.7", factors: [
    { id: "1", name: "Financial Impact", value: "3", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Reputational Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" },
    { id: "3", name: "Operational Impact", value: "3", weighting: "20", type: "child" as FactorType, comments: "" },
    { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" }
  ]},
  { date: "2023-12-10", score: "3.9", factors: [
    { id: "1", name: "Financial Impact", value: "4", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Reputational Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" },
    { id: "3", name: "Operational Impact", value: "3", weighting: "20", type: "child" as FactorType, comments: "" },
    { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", type: "child" as FactorType, comments: "" }
  ]},
  { date: "2023-09-05", score: "3.5", factors: [
    { id: "1", name: "Financial Impact", value: "3", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Reputational Impact", value: "3", weighting: "25", type: "child" as FactorType, comments: "" },
    { id: "3", name: "Operational Impact", value: "4", weighting: "20", type: "child" as FactorType, comments: "" },
    { id: "4", name: "Regulatory Impact", value: "3", weighting: "25", type: "child" as FactorType, comments: "" }
  ]},
];

const CONTROL_HISTORICAL: { date: string; score: string; controls: Control[] }[] = [
  { date: "2024-03-15", score: "2.3", controls: [
    { id: "1", controlId: "CTL-001", name: "Access Control Management", effectiveness: "3", weighting: "25", designEffect: "effective", operativeEffect: "partially", isKeyControl: true, category: "preventive", comments: "Works well" },
    { id: "2", controlId: "CTL-002", name: "Change Management Process", effectiveness: "2", weighting: "25", designEffect: "highly", operativeEffect: "effective", isKeyControl: false, category: "detective", comments: "Good process" },
    { id: "3", controlId: "CTL-003", name: "Incident Response", effectiveness: "2", weighting: "25", designEffect: "effective", operativeEffect: "effective", isKeyControl: true, category: "corrective", comments: "" },
    { id: "4", controlId: "CTL-004", name: "Monitoring & Logging", effectiveness: "3", weighting: "25", designEffect: "partially", operativeEffect: "effective", isKeyControl: false, category: "detective", comments: "" }
  ]},
  { date: "2023-12-10", score: "2.5", controls: [
    { id: "1", controlId: "CTL-001", name: "Access Control Management", effectiveness: "3", weighting: "25", designEffect: "effective", operativeEffect: "partially", isKeyControl: true, category: "preventive", comments: "" },
    { id: "2", controlId: "CTL-002", name: "Change Management Process", effectiveness: "2", weighting: "25", designEffect: "effective", operativeEffect: "effective", isKeyControl: false, category: "detective", comments: "" }
  ]},
  { date: "2023-09-05", score: "2.8", controls: [] },
];

const RESIDUAL_HISTORICAL = [
  { date: "2024-03-15", score: "2.4", factors: [
    { id: "1", name: "Adjusted Financial Impact", value: "2", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Adjusted Reputational Impact", value: "3", weighting: "25", type: "child" as FactorType, comments: "" },
    { id: "3", name: "Adjusted Operational Impact", value: "2", weighting: "20", type: "child" as FactorType, comments: "" },
    { id: "4", name: "Adjusted Regulatory Impact", value: "3", weighting: "25", type: "child" as FactorType, comments: "" }
  ]},
  { date: "2023-12-10", score: "3.2", factors: [
    { id: "1", name: "Adjusted Financial Impact", value: "3", weighting: "30", type: "child" as FactorType, comments: "" },
    { id: "2", name: "Adjusted Reputational Impact", value: "3", weighting: "25", type: "child" as FactorType, comments: "" }
  ]},
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
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const { formState } = useForm();
  const { activeTab: activeFormSection } = useAssessmentNavigation();

  const handleTabClick = (tabId: PanelTab) => {
    if (activeTab === tabId) {
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
      setSelectedDateIndex(0);
    }
  };

  const getAssessmentTitle = () => {
    switch (activeFormSection) {
      case "inherent":
        return "Inherent Risk History";
      case "control":
        return "Control Effectiveness History";
      case "residual":
        return "Residual Risk History";
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

  const getRatingBadge = (value: string) => {
    const numVal = parseFloat(value);
    const label = getScoreLabel(value);
    const colorClass = numVal <= 2 ? "bg-green-100 text-green-700 border-green-200" :
                       numVal <= 3 ? "bg-amber-100 text-amber-700 border-amber-200" :
                       "bg-red-100 text-red-700 border-red-200";
    return (
      <Badge variant="outline" className={cn("text-xs font-medium", colorClass)}>
        {label} ({value})
      </Badge>
    );
  };

  const renderFactorsTable = (factors: { id: string; name: string; value: string; weighting: string }[]) => (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-3 py-2 font-medium text-slate-600">Factor</th>
            <th className="text-center px-3 py-2 font-medium text-slate-600">Rating</th>
            <th className="text-right px-3 py-2 font-medium text-slate-600">Weight (%)</th>
          </tr>
        </thead>
        <tbody>
          {factors.map((factor, idx) => (
            <tr key={factor.id} className={cn(idx !== factors.length - 1 && "border-b border-slate-100")}>
              <td className="px-3 py-2.5 text-slate-700">{factor.name}</td>
              <td className="px-3 py-2.5 text-center">{getRatingBadge(factor.value)}</td>
              <td className="px-3 py-2.5 text-right text-slate-600">{factor.weighting}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderControlsTable = (controls: Control[]) => (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-3 py-2 font-medium text-slate-600">Control</th>
            <th className="text-center px-3 py-2 font-medium text-slate-600">Effectiveness</th>
            <th className="text-right px-3 py-2 font-medium text-slate-600">Weight (%)</th>
          </tr>
        </thead>
        <tbody>
          {controls.map((control, idx) => (
            <tr key={control.id} className={cn(idx !== controls.length - 1 && "border-b border-slate-100")}>
              <td className="px-3 py-2.5 text-slate-700">
                <div className="flex items-center gap-1.5">
                  {control.name}
                  {control.isKeyControl && (
                    <Badge variant="outline" className="text-[10px] px-1 py-0 bg-blue-50 text-blue-600 border-blue-200">Key</Badge>
                  )}
                </div>
              </td>
              <td className="px-3 py-2.5 text-center">{getRatingBadge(control.effectiveness)}</td>
              <td className="px-3 py-2.5 text-right text-slate-600">{control.weighting}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAssessmentsContent = () => {
    let data: { date: string; score: string; factors?: any[]; controls?: Control[] }[] = [];
    let isControl = false;

    switch (activeFormSection) {
      case "inherent":
        data = INHERENT_HISTORICAL;
        break;
      case "control":
        data = CONTROL_HISTORICAL;
        isControl = true;
        break;
      case "residual":
        data = RESIDUAL_HISTORICAL;
        break;
      default:
        return (
          <div className="text-center py-8 text-slate-500">
            <History className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No Historical Data</p>
            <p className="text-xs mt-1">Select Inherent Rating, Control Effectiveness, or Residual Rating to view historical assessments</p>
          </div>
        );
    }

    const selectedAssessment = data[selectedDateIndex];
    const hasDetails = isControl 
      ? (selectedAssessment as any).controls?.length > 0 
      : selectedAssessment.factors?.length > 0;

    return (
      <div className="space-y-4">
        {/* Title with icon */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">{getAssessmentTitle()}</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3.5 w-3.5 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Historical assessment data for comparison</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Date badges */}
        <div className="flex flex-wrap gap-2">
          {data.map((assessment, idx) => (
            <Badge
              key={assessment.date}
              variant={selectedDateIndex === idx ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all text-xs",
                selectedDateIndex === idx 
                  ? "bg-slate-800 text-white hover:bg-slate-700" 
                  : "bg-white hover:bg-slate-50"
              )}
              onClick={() => setSelectedDateIndex(idx)}
            >
              {assessment.date}
            </Badge>
          ))}
        </div>

        {/* Score and Copy button */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm font-medium px-3 py-1",
              getScoreColor(selectedAssessment.score)
            )}
          >
            Score: {selectedAssessment.score} ({getScoreLabel(selectedAssessment.score)})
          </Badge>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy to current
          </Button>
        </div>

        {/* Details table */}
        {hasDetails ? (
          isControl 
            ? renderControlsTable((selectedAssessment as any).controls)
            : renderFactorsTable(selectedAssessment.factors!)
        ) : (
          <div className="text-center py-6 text-slate-400 text-sm border border-dashed border-slate-200 rounded-lg">
            No detailed data available for this assessment
          </div>
        )}
      </div>
    );
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