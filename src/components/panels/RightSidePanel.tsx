import React, { useState } from "react";
import { History, Scale, Target, Shield, Clipboard, BarChart3, FileText, MessageSquareWarning, Clock, Info, Copy, ChevronRight, X } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

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
  accentColor: string;
}

const TABS: TabConfig[] = [
  { id: "assessments", label: "Previous Assessments", icon: <History className="h-4 w-4" />, accentColor: "bg-indigo-500" },
  { id: "review", label: "Review & Challenge", icon: <MessageSquareWarning className="h-4 w-4" />, accentColor: "bg-amber-500" },
  { id: "treatment", label: "Treatment", icon: <Clipboard className="h-4 w-4" />, accentColor: "bg-emerald-500" },
  { id: "metrics", label: "Metrics & Losses", icon: <BarChart3 className="h-4 w-4" />, accentColor: "bg-violet-500" },
  { id: "details", label: "Additional Details", icon: <FileText className="h-4 w-4" />, accentColor: "bg-slate-500" },
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

  const getSectionAccentColor = () => {
    switch (activeFormSection) {
      case "inherent":
        return "from-amber-500/10 to-orange-500/5";
      case "control":
        return "from-emerald-500/10 to-green-500/5";
      case "residual":
        return "from-blue-500/10 to-indigo-500/5";
      default:
        return "from-slate-500/10 to-slate-500/5";
    }
  };

  const getSectionIconBg = () => {
    switch (activeFormSection) {
      case "inherent":
        return "bg-amber-100 text-amber-600";
      case "control":
        return "bg-emerald-100 text-emerald-600";
      case "residual":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getAssessmentIcon = () => {
    switch (activeFormSection) {
      case "inherent":
        return <Scale className="h-4 w-4" />;
      case "control":
        return <Shield className="h-4 w-4" />;
      case "residual":
        return <Target className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getRatingBadge = (value: string) => {
    const numVal = parseFloat(value);
    const label = getScoreLabel(value);
    const colorClass = numVal <= 2 ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100" :
                       numVal <= 3 ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100" :
                       "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100";
    return (
      <Badge variant="outline" className={cn("text-xs font-medium px-2 py-0.5", colorClass)}>
        {label} ({value})
      </Badge>
    );
  };

  const renderFactorsTable = (factors: { id: string; name: string; value: string; weighting: string }[]) => (
    <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Factor</th>
            <th className="text-center px-3 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Rating</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Weight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {factors.map((factor) => (
            <tr key={factor.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-slate-700 font-medium">{factor.name}</td>
              <td className="px-3 py-3 text-center">{getRatingBadge(factor.value)}</td>
              <td className="px-4 py-3 text-right">
                <span className="text-slate-500 font-medium">{factor.weighting}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderControlsTable = (controls: Control[]) => (
    <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
            <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Control</th>
            <th className="text-center px-3 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Effectiveness</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Weight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {controls.map((control) => (
            <tr key={control.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{control.name}</span>
                  {control.isKeyControl && (
                    <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 border-0 font-semibold">
                      Key
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-3 py-3 text-center">{getRatingBadge(control.effectiveness)}</td>
              <td className="px-4 py-3 text-right">
                <span className="text-slate-500 font-medium">{control.weighting}%</span>
              </td>
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
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">No Historical Data</p>
            <p className="text-xs text-slate-400 text-center max-w-[200px]">
              Select Inherent Rating, Control Effectiveness, or Residual Rating to view historical assessments
            </p>
          </div>
        );
    }

    const selectedAssessment = data[selectedDateIndex];
    const hasDetails = isControl 
      ? (selectedAssessment as any).controls?.length > 0 
      : selectedAssessment.factors?.length > 0;

    return (
      <div className="space-y-5">
        {/* Header Card */}
        <div className={cn(
          "rounded-xl p-4 bg-gradient-to-br border border-white/50",
          getSectionAccentColor()
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", getSectionIconBg())}>
              {getAssessmentIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-800">{getAssessmentTitle()}</h3>
              <p className="text-xs text-slate-500">{data.length} historical records</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-7 h-7 rounded-lg bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs">Historical assessment data for comparison</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Date Selection */}
          <div className="flex flex-wrap gap-2">
            {data.map((assessment, idx) => (
              <button
                key={assessment.date}
                onClick={() => setSelectedDateIndex(idx)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  selectedDateIndex === idx 
                    ? "bg-slate-800 text-white shadow-md shadow-slate-800/20" 
                    : "bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm border border-slate-200/50"
                )}
              >
                {assessment.date}
              </button>
            ))}
          </div>
        </div>

        {/* Score Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Assessment Score</p>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-sm font-semibold px-3 py-1.5",
                  getScoreColor(selectedAssessment.score)
                )}
              >
                {selectedAssessment.score} — {getScoreLabel(selectedAssessment.score)}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-xs gap-2 bg-white hover:bg-slate-50 border-slate-200 shadow-sm"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy to current
            </Button>
          </div>
        </div>

        {/* Divider with label */}
        <div className="relative">
          <Separator className="bg-slate-200/60" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {isControl ? "Controls" : "Factors"}
          </span>
        </div>

        {/* Details table */}
        {hasDetails ? (
          isControl 
            ? renderControlsTable((selectedAssessment as any).controls)
            : renderFactorsTable(selectedAssessment.factors!)
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 text-center">No detailed data available for this assessment</p>
          </div>
        )}
      </div>
    );
  };

  const renderReviewContent = () => {
    const challenge = formState.challengeDetails;
    
    return (
      <div className="space-y-5">
        {challenge ? (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <MessageSquareWarning className="h-4 w-4 text-amber-600" />
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-0 font-semibold">
                  Challenge Active
                </Badge>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">{challenge.justification}</p>
              <div className="mt-3 pt-3 border-t border-amber-200/50">
                <p className="text-xs text-amber-600 font-medium">
                  By {challenge.reviewer} • {challenge.date.toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {challenge.reasons && challenge.reasons.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Challenged Sections</h4>
                <div className="flex flex-wrap gap-2">
                  {challenge.reasons.map((reason, idx) => (
                    <Badge key={idx} className="bg-slate-100 text-slate-700 border-0 font-medium">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
              <MessageSquareWarning className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">No Active Challenges</p>
            <p className="text-xs text-slate-400 text-center">This assessment has not been challenged</p>
          </div>
        )}
        
        <Separator className="bg-slate-200/60" />
        
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Comment Activity</h4>
          <p className="text-sm text-slate-500">View and manage comments through the Activity panel in the header.</p>
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
  const activeTabConfig = TABS.find(t => t.id === activeTab);

  return (
    <div className="fixed right-0 top-[140px] bottom-0 flex z-30">
      {/* Expanded Panel Content */}
      {isExpanded && (
        <div className="w-[400px] bg-gradient-to-b from-slate-50 to-white border-l border-slate-200/80 shadow-2xl shadow-slate-900/5 overflow-hidden flex flex-col animate-slide-in-right">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("w-2 h-8 rounded-full", activeTabConfig?.accentColor)} />
              <div>
                <h2 className="font-semibold text-slate-800">
                  {activeTab === "assessments" ? getAssessmentTitle() : activeTabConfig?.label}
                </h2>
                <p className="text-xs text-slate-400">Quick reference panel</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100"
              onClick={() => setActiveTab(null)}
            >
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
          
          {/* Panel Content */}
          <ScrollArea className="flex-1">
            <div className="p-5">
              {renderContent()}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Vertical Tab Strip */}
      <div className="w-12 bg-white/95 backdrop-blur-sm border-l border-slate-200/60 flex flex-col items-center pt-3 gap-1 shadow-lg shadow-slate-900/5">
        {TABS.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-slate-100 text-slate-800 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {tab.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-medium">
              {tab.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default RightSidePanel;
