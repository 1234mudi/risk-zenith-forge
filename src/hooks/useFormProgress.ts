import { useForm } from "@/contexts/FormContext";
import { useCollaboration } from "@/contexts/CollaborationContext";

export type SectionStatus = "pending" | "in-progress" | "completed";

export interface SectionProgress {
  total: number;
  completed: number;
  percentage: number;
  status: SectionStatus;
  hasCollaborators: boolean;
}

export interface FormProgress {
  inherent: SectionProgress;
  control: SectionProgress;
  residual: SectionProgress;
  heatmap: SectionProgress;
  issues: SectionProgress;
}

export const TAB_ORDER = [
  "inherent", 
  "control",
  "residual",
  "heatmap",
  "issues"
] as const;

export const TAB_LABELS: Record<string, string> = {
  inherent: "Inherent Rating",
  control: "Control Effectiveness",
  residual: "Residual Rating",
  heatmap: "Heat Map",
  issues: "Issues"
};

export const useFormProgress = () => {
  const { formState } = useForm();
  const { collaborationState } = useCollaboration();

  const getStatus = (percentage: number, total: number): SectionStatus => {
    if (total === 0) return "completed"; // View-only sections
    if (percentage === 100) return "completed";
    if (percentage > 0) return "in-progress";
    return "pending";
  };

  const calculateProgress = (fields: string[], sectionId: string): SectionProgress => {
    const total = fields.length;
    const completed = fields.filter(field => {
      const value = formState[field as keyof typeof formState];
      return value !== "" && value !== undefined && value !== null;
    }).length;
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const sectionCollab = collaborationState[sectionId as keyof typeof collaborationState];
    
    return {
      total,
      completed,
      percentage,
      status: getStatus(percentage, total),
      hasCollaborators: sectionCollab ? sectionCollab.collaborators.length > 0 : false
    };
  };

  const progress: FormProgress = {
    inherent: calculateProgress([
      "inherentImpactFinancial",
      "inherentImpactReputation",
      "inherentImpactOperational",
      "inherentImpactCompliance",
      "inherentLikelihoodFrequency",
      "inherentLikelihoodProbability"
    ], "inherent"),
    control: calculateProgress([
      "controlDesignEffectiveness",
      "controlOperatingEffectiveness",
      "controlMaturity",
      "controlCoverage"
    ], "control"),
    residual: calculateProgress([
      "residualImpactFinancial",
      "residualImpactReputation",
      "residualImpactOperational",
      "residualImpactCompliance",
      "residualLikelihoodFrequency",
      "residualLikelihoodProbability"
    ], "residual"),
    heatmap: {
      total: 0,
      completed: 0,
      percentage: 100,
      status: "completed",
      hasCollaborators: collaborationState.heatmap?.collaborators.length > 0
    },
    issues: calculateProgress([
      "issueDescription",
      "issueSeverity",
      "issueStatus"
    ], "issues")
  };

  // Find the next required section (first incomplete section in order)
  const getNextRequiredSection = (): string | null => {
    for (const tabId of TAB_ORDER) {
      const sectionProgress = progress[tabId as keyof FormProgress];
      if (sectionProgress.status !== "completed") {
        return tabId;
      }
    }
    return null;
  };

  // Get overall completion percentage
  const getOverallProgress = (): number => {
    const sections = TAB_ORDER.filter(id => progress[id as keyof FormProgress].total > 0);
    if (sections.length === 0) return 100;
    
    const totalCompleted = sections.reduce((sum, id) => {
      return sum + progress[id as keyof FormProgress].percentage;
    }, 0);
    
    return Math.round(totalCompleted / sections.length);
  };

  return {
    ...progress,
    nextRequiredSection: getNextRequiredSection(),
    overallProgress: getOverallProgress()
  };
};
