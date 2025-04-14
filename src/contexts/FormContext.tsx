
import React, { createContext, useContext, useState, ReactNode } from "react";

type FormState = {
  // System generated IDs
  referenceId: string;
  assessmentId: string;
  eraId: string;
  riskIdDisplay: string;
  
  // Risk Definition
  organization: string;
  assessableItem: string;
  risk: string;
  riskHierarchy: string;
  
  // Assessment Guidance
  scope: string;
  instructions: string;
  
  // Treatment Plan
  riskTreatment: string;
  treatmentOwner: string;
  treatmentMethodology: string;
  assessmentDate: string;
  
  // Assessment sections
  inherentFactors: any[];
  controls: any[];
  residualFactors: any[];
  issues: any[];
  
  // Comments & Attachments
  comments: string;
  attachments: any[];

  // Scores
  inherentRatingScore: string;
  controlEffectivenessScore: string;
  residualRatingScore: string;

  // Previous assessment data
  previousInherentFactors: any[];
  previousControls: any[];
  previousResidualFactors: any[];
  previousInherentRatingScore: string;
  previousControlEffectivenessScore: string;
  previousResidualRatingScore: string;
  previousAssessmentDate: string;

  // UI state
  showWeights: boolean;
};

type FormContextType = {
  formState: FormState;
  updateForm: (update: Partial<FormState>) => void;
};

const initialFormState: FormState = {
  referenceId: "RA-2025-0001",
  assessmentId: "ASM-1043",
  eraId: "ERA-7752",
  riskIdDisplay: "RISK-2025-043",
  
  organization: "Global Banking Corp",
  assessableItem: "Customer Due Diligence",
  risk: "KYC Risk Assessment Inadequacy",
  riskHierarchy: "Compliance Risk > Regulatory Risk > KYC Risk",
  
  scope: "This assessment covers all customer due diligence processes in the retail banking division.",
  instructions: "Evaluate the inherent and residual risk levels based on the factors provided.",
  
  riskTreatment: "Mitigation",
  treatmentOwner: "Jane Smith, Compliance Manager",
  treatmentMethodology: "Enhanced monitoring and additional training",
  assessmentDate: "2025-04-10",
  
  inherentFactors: [
    { id: "1", name: "Financial Impact", value: "4", weighting: "25", comments: "Significant financial penalties could be imposed" },
    { id: "2", name: "Reputational Impact", value: "3", weighting: "25", comments: "Media coverage and customer trust issues" },
    { id: "3", name: "Operational Impact", value: "2", weighting: "25", comments: "Some processes would need revision" },
    { id: "4", name: "Regulatory Impact", value: "5", weighting: "25", comments: "Direct violation of key regulations" }
  ],
  controls: [
    {
      id: "1",
      controlId: "CTL-001",
      name: "Access Control Management",
      designEffect: "effective",
      operativeEffect: "partially",
      effectiveness: "3",
      weighting: "25",
      isKeyControl: true,
      category: "preventive",
      comments: "Works well in most cases",
      testResults: {
        lastTested: "2023-12-15",
        result: "pass",
        tester: "John Smith",
        findings: "No significant issues found"
      }
    },
    {
      id: "2",
      controlId: "CTL-002",
      name: "Change Management Process",
      designEffect: "highly",
      operativeEffect: "effective",
      effectiveness: "2",
      weighting: "25",
      isKeyControl: false,
      category: "detective",
      comments: "Well designed but some implementation issues",
      testResults: {
        lastTested: "2024-01-20",
        result: "partial",
        tester: "Emily Johnson",
        findings: "Some approvals were missing"
      }
    }
  ],
  residualFactors: [
    { id: "1", name: "Financial Impact", value: "2", weighting: "25", comments: "Controls reduce potential penalties" },
    { id: "2", name: "Reputational Impact", value: "2", weighting: "25", comments: "Proactive PR strategy in place" },
    { id: "3", name: "Operational Impact", value: "1", weighting: "25", comments: "Processes optimized" },
    { id: "4", name: "Regulatory Impact", value: "3", weighting: "25", comments: "Some compliance gaps remain" }
  ],
  issues: [],
  
  comments: "",
  attachments: [],

  inherentRatingScore: "3.5",
  controlEffectivenessScore: "2.5",
  residualRatingScore: "2.0",

  // Previous assessment data
  previousInherentFactors: [
    { id: "1", name: "Financial Impact", value: "3", weighting: "25", comments: "Potential for moderate penalties" },
    { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "High visibility in media" },
    { id: "3", name: "Operational Impact", value: "3", weighting: "25", comments: "Moderate process disruption" },
    { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Significant regulatory concerns" }
  ],
  previousControls: [
    {
      id: "1",
      controlId: "CTL-001",
      name: "Access Control Management",
      designEffect: "partially",
      operativeEffect: "partially",
      effectiveness: "3",
      weighting: "40",
      isKeyControl: true,
      category: "preventive",
      comments: "Needs improvement",
      testResults: {
        lastTested: "2023-06-10",
        result: "partial",
        tester: "John Smith",
        findings: "Several issues found in implementation"
      }
    },
    {
      id: "2",
      controlId: "CTL-002",
      name: "Change Management Process",
      designEffect: "ineffective",
      operativeEffect: "ineffective",
      effectiveness: "4",
      weighting: "60",
      isKeyControl: false,
      category: "detective",
      comments: "Process is not well defined",
      testResults: {
        lastTested: "2023-07-15",
        result: "fail",
        tester: "Emily Johnson",
        findings: "Multiple approvals missing, documentation incomplete"
      }
    }
  ],
  previousResidualFactors: [
    { id: "1", name: "Financial Impact", value: "3", weighting: "25", comments: "Controls not fully effective" },
    { id: "2", name: "Reputational Impact", value: "3", weighting: "25", comments: "Some improvements made" },
    { id: "3", name: "Operational Impact", value: "2", weighting: "25", comments: "Better processes implemented" },
    { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Major compliance gaps" }
  ],
  previousInherentRatingScore: "3.5",
  previousControlEffectivenessScore: "3.6",
  previousResidualRatingScore: "3.0",
  previousAssessmentDate: "2024-10-15",

  showWeights: true
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const updateForm = (update: Partial<FormState>) => {
    setFormState((prevState) => ({
      ...prevState,
      ...update
    }));
  };

  return (
    <FormContext.Provider value={{ formState, updateForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
