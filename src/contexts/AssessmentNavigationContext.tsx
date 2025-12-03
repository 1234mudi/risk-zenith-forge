import React, { createContext, useContext, useState, ReactNode } from "react";

type AssessmentTab = "inherent" | "control" | "residual" | "heatmap" | "issues";

interface AssessmentNavigationContextType {
  activeTab: AssessmentTab;
  setActiveTab: (tab: AssessmentTab) => void;
}

const AssessmentNavigationContext = createContext<AssessmentNavigationContextType | undefined>(undefined);

export const AssessmentNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<AssessmentTab>("inherent");

  return (
    <AssessmentNavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AssessmentNavigationContext.Provider>
  );
};

export const useAssessmentNavigation = () => {
  const context = useContext(AssessmentNavigationContext);
  if (!context) {
    throw new Error("useAssessmentNavigation must be used within an AssessmentNavigationProvider");
  }
  return context;
};
