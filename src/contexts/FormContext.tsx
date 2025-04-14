
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
  
  scope: "",
  instructions: "",
  
  riskTreatment: "",
  treatmentOwner: "",
  treatmentMethodology: "",
  assessmentDate: "",
  
  inherentFactors: [],
  controls: [],
  residualFactors: [],
  issues: [],
  
  comments: "",
  attachments: [],

  inherentRatingScore: "0.0",
  controlEffectivenessScore: "0.0",
  residualRatingScore: "0.0",

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
