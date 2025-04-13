
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
  
  organization: "",
  assessableItem: "",
  risk: "",
  
  riskTreatment: "",
  treatmentOwner: "",
  treatmentMethodology: "",
  assessmentDate: "",
  
  inherentFactors: [],
  controls: [],
  residualFactors: [],
  issues: [],
  
  comments: "",
  attachments: []
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
