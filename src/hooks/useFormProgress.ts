import { useForm } from "@/contexts/FormContext";

export interface SectionProgress {
  total: number;
  completed: number;
  percentage: number;
}

export const useFormProgress = () => {
  const { formState } = useForm();

  const calculateProgress = (fields: string[]): SectionProgress => {
    const total = fields.length;
    const completed = fields.filter(field => {
      const value = formState[field as keyof typeof formState];
      return value !== "" && value !== undefined && value !== null;
    }).length;
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const generalProgress = calculateProgress([
    "riskDescription",
    "organization",
    "assessableItem",
    "assessmentDate",
    "assessmentOwner",
    "riskOwner"
  ]);

  const inherentProgress = calculateProgress([
    "inherentImpactFinancial",
    "inherentImpactReputation",
    "inherentImpactOperational",
    "inherentImpactCompliance",
    "inherentLikelihoodFrequency",
    "inherentLikelihoodProbability"
  ]);

  const controlProgress = calculateProgress([
    "controlDesignEffectiveness",
    "controlOperatingEffectiveness",
    "controlMaturity",
    "controlCoverage"
  ]);

  const residualProgress = calculateProgress([
    "residualImpactFinancial",
    "residualImpactReputation",
    "residualImpactOperational",
    "residualImpactCompliance",
    "residualLikelihoodFrequency",
    "residualLikelihoodProbability"
  ]);

  const treatmentProgress = calculateProgress([
    "treatmentStrategy",
    "treatmentPlan",
    "treatmentOwner",
    "treatmentDeadline"
  ]);

  const metricsProgress = calculateProgress([
    "keyRiskIndicator",
    "threshold",
    "currentValue"
  ]);

  const issuesProgress = calculateProgress([
    "issueDescription",
    "issueSeverity",
    "issueStatus"
  ]);

  const commentsProgress = calculateProgress([
    "additionalComments",
    "attachments"
  ]);

  return {
    general: generalProgress,
    inherent: inherentProgress,
    control: controlProgress,
    residual: residualProgress,
    heatmap: { total: 0, completed: 0, percentage: 100 }, // View-only
    treatment: treatmentProgress,
    metrics: metricsProgress,
    issues: issuesProgress,
    comments: commentsProgress
  };
};
