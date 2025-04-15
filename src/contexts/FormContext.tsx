
import React, { createContext, useContext, useState, ReactNode } from "react";

// Type for historical assessment data
type HistoricalAssessment = {
  assessmentDate: string;
  inherentRatingScore: string;
  controlEffectivenessScore: string;
  residualRatingScore: string;
  inherentFactors: any[];
  controls: any[];
  residualFactors: any[];
  assessor: string;
  notes?: string;
};

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
  
  // Overrides
  inherentRatingOverridden: boolean;
  residualRatingOverridden: boolean;
  inherentRatingOverrideComment: string;
  residualRatingOverrideComment: string;

  // Previous assessment data
  previousInherentFactors: any[];
  previousControls: any[];
  previousResidualFactors: any[];
  previousInherentRatingScore: string;
  previousControlEffectivenessScore: string;
  previousResidualRatingScore: string;
  previousAssessmentDate: string;

  // Historical assessment data (up to 5 previous assessments)
  historicalAssessments: HistoricalAssessment[];

  // Risk Appetite
  riskAppetite: {
    level: string;
    description: string;
    threshold: string;
    color: string;
  };
  isWithinAppetite: boolean;
  appetiteBreachIssues: any[];

  // UI state
  showWeights: boolean;
};

type FormContextType = {
  formState: FormState;
  updateForm: (update: Partial<FormState>) => void;
  addAppetiteBreachIssue: (issue: any) => void;
};

// Mock historical assessment data
const historicalAssessmentsData: HistoricalAssessment[] = [
  {
    assessmentDate: "2024-10-15",
    inherentRatingScore: "3.5",
    controlEffectivenessScore: "3.6",
    residualRatingScore: "3.0",
    inherentFactors: [
      { id: "1", name: "Financial Impact", value: "3", weighting: "25", comments: "Potential for moderate penalties" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "High visibility in media" },
      { id: "3", name: "Operational Impact", value: "3", weighting: "25", comments: "Moderate process disruption" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Significant regulatory concerns" }
    ],
    controls: [
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
    residualFactors: [
      { id: "1", name: "Financial Impact", value: "3", weighting: "25", comments: "Controls not fully effective" },
      { id: "2", name: "Reputational Impact", value: "3", weighting: "25", comments: "Some improvements made" },
      { id: "3", name: "Operational Impact", value: "2", weighting: "25", comments: "Better processes implemented" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Major compliance gaps" }
    ],
    assessor: "Jane Smith",
    notes: "Initial assessment highlighted significant control gaps"
  },
  {
    assessmentDate: "2024-01-10",
    inherentRatingScore: "3.7",
    controlEffectivenessScore: "3.8",
    residualRatingScore: "3.2",
    inherentFactors: [
      { id: "1", name: "Financial Impact", value: "4", weighting: "25", comments: "Increased financial risk" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "Public scrutiny increased" },
      { id: "3", name: "Operational Impact", value: "3", weighting: "25", comments: "Process gaps identified" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Regulatory pressure increased" }
    ],
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "ineffective",
        operativeEffect: "partially",
        effectiveness: "4",
        weighting: "40",
        isKeyControl: true,
        category: "preventive",
        comments: "Control design weaknesses",
        testResults: {
          lastTested: "2023-12-05",
          result: "fail",
          tester: "John Smith",
          findings: "Major design flaws"
        }
      },
      {
        id: "2",
        controlId: "CTL-002",
        name: "Change Management Process",
        designEffect: "partially",
        operativeEffect: "ineffective",
        effectiveness: "4",
        weighting: "60",
        isKeyControl: false,
        category: "detective",
        comments: "Implementation issues",
        testResults: {
          lastTested: "2023-12-10",
          result: "partial",
          tester: "Emily Johnson",
          findings: "Process not being followed"
        }
      }
    ],
    residualFactors: [
      { id: "1", name: "Financial Impact", value: "3", weighting: "25", comments: "Some mitigation through monitoring" },
      { id: "2", name: "Reputational Impact", value: "3", weighting: "25", comments: "PR strategies implemented" },
      { id: "3", name: "Operational Impact", value: "3", weighting: "25", comments: "Process issues remain" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Regulatory findings unresolved" }
    ],
    assessor: "Mark Johnson",
    notes: "Second assessment showed minimal improvement"
  },
  {
    assessmentDate: "2023-07-15",
    inherentRatingScore: "4.0",
    controlEffectivenessScore: "4.1",
    residualRatingScore: "3.5",
    inherentFactors: [
      { id: "1", name: "Financial Impact", value: "4", weighting: "25", comments: "Severe financial implications" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "Negative media coverage" },
      { id: "3", name: "Operational Impact", value: "4", weighting: "25", comments: "Significant process failures" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Potential for regulatory action" }
    ],
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "ineffective",
        operativeEffect: "ineffective",
        effectiveness: "5",
        weighting: "40",
        isKeyControl: true,
        category: "preventive",
        comments: "Significant control failures",
        testResults: {
          lastTested: "2023-05-10",
          result: "fail",
          tester: "John Smith",
          findings: "Complete failure of control"
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
        comments: "Poorly designed and implemented",
        testResults: {
          lastTested: "2023-05-15",
          result: "fail",
          tester: "Emily Johnson",
          findings: "No adherence to process"
        }
      }
    ],
    residualFactors: [
      { id: "1", name: "Financial Impact", value: "3", weighting: "25", comments: "Limited mitigation" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "High public visibility" },
      { id: "3", name: "Operational Impact", value: "3", weighting: "25", comments: "Some workarounds in place" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Regulatory issues ongoing" }
    ],
    assessor: "Sarah Williams",
    notes: "Initial baseline assessment"
  },
  {
    assessmentDate: "2023-01-20",
    inherentRatingScore: "4.2",
    controlEffectivenessScore: "4.3",
    residualRatingScore: "3.7",
    inherentFactors: [
      { id: "1", name: "Financial Impact", value: "5", weighting: "25", comments: "Critical financial risk" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "Major media coverage" },
      { id: "3", name: "Operational Impact", value: "4", weighting: "25", comments: "Critical process issues" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Imminent regulatory action" }
    ],
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "ineffective",
        operativeEffect: "ineffective",
        effectiveness: "5",
        weighting: "40",
        isKeyControl: true,
        category: "preventive",
        comments: "Critical control flaws",
        testResults: {
          lastTested: "2022-12-05",
          result: "fail",
          tester: "John Smith",
          findings: "Systemic failures in control design"
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
        comments: "No effective process",
        testResults: {
          lastTested: "2022-12-10",
          result: "fail",
          tester: "Emily Johnson",
          findings: "Complete absence of controls"
        }
      }
    ],
    residualFactors: [
      { id: "1", name: "Financial Impact", value: "4", weighting: "25", comments: "Minimal controls" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "No effective PR strategy" },
      { id: "3", name: "Operational Impact", value: "3", weighting: "25", comments: "Basic workarounds only" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Direct regulatory violations" }
    ],
    assessor: "Michael Brown",
    notes: "Initial discovery assessment"
  },
  {
    assessmentDate: "2022-07-05",
    inherentRatingScore: "4.5",
    controlEffectivenessScore: "4.7",
    residualRatingScore: "4.0",
    inherentFactors: [
      { id: "1", name: "Financial Impact", value: "5", weighting: "25", comments: "Severe financial penalties" },
      { id: "2", name: "Reputational Impact", value: "5", weighting: "25", comments: "Catastrophic reputational damage" },
      { id: "3", name: "Operational Impact", value: "4", weighting: "25", comments: "Major operational disruption" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "Severe regulatory consequences" }
    ],
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "ineffective",
        operativeEffect: "ineffective",
        effectiveness: "5",
        weighting: "40",
        isKeyControl: true,
        category: "preventive",
        comments: "No controls in place",
        testResults: {
          lastTested: "2022-05-15",
          result: "fail",
          tester: "John Smith",
          findings: "No control framework"
        }
      },
      {
        id: "2",
        controlId: "CTL-002",
        name: "Change Management Process",
        designEffect: "ineffective",
        operativeEffect: "ineffective",
        effectiveness: "5",
        weighting: "60",
        isKeyControl: false,
        category: "detective",
        comments: "Completely ineffective",
        testResults: {
          lastTested: "2022-05-20",
          result: "fail",
          tester: "Emily Johnson",
          findings: "No controls implemented"
        }
      }
    ],
    residualFactors: [
      { id: "1", name: "Financial Impact", value: "4", weighting: "25", comments: "No effective controls" },
      { id: "2", name: "Reputational Impact", value: "4", weighting: "25", comments: "No mitigation strategies" },
      { id: "3", name: "Operational Impact", value: "4", weighting: "25", comments: "Critical operational gaps" },
      { id: "4", name: "Regulatory Impact", value: "4", weighting: "25", comments: "No compliance measures" }
    ],
    assessor: "Jennifer Davis",
    notes: "Baseline risk assessment before program implementation"
  }
];

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
  
  inherentRatingOverridden: false,
  residualRatingOverridden: false,
  inherentRatingOverrideComment: "",
  residualRatingOverrideComment: "",

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

  // Historical assessment data
  historicalAssessments: historicalAssessmentsData,

  // Risk Appetite
  riskAppetite: {
    level: "Low",
    description: "The organization has a low appetite for compliance risks. Residual risk rating above 2.0 is considered outside appetite.",
    threshold: "2.0",
    color: "#22c55e", // green-500
  },
  isWithinAppetite: true,
  appetiteBreachIssues: [],

  showWeights: true
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  // Check if current residual risk rating is within appetite
  const checkRiskAppetite = (currentState: FormState, update: Partial<FormState>) => {
    const updatedState = { ...currentState, ...update };
    const residualScore = parseFloat(updatedState.residualRatingScore || "0");
    const appetiteThreshold = parseFloat(updatedState.riskAppetite.threshold || "0");
    
    return {
      ...updatedState,
      isWithinAppetite: residualScore <= appetiteThreshold
    };
  };

  const updateForm = (update: Partial<FormState>) => {
    setFormState((prevState) => {
      const updatedState = checkRiskAppetite(prevState, update);
      return updatedState;
    });
  };

  // Add a new issue related to risk appetite breach
  const addAppetiteBreachIssue = (issue: any) => {
    setFormState((prevState) => ({
      ...prevState,
      appetiteBreachIssues: [...prevState.appetiteBreachIssues, issue],
      issues: [...prevState.issues, issue]
    }));
  };

  return (
    <FormContext.Provider value={{ formState, updateForm, addAppetiteBreachIssue }}>
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
