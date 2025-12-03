import React from "react";
import { FormProvider } from "@/contexts/FormContext";
import { CollaborationProvider } from "@/contexts/CollaborationContext";
import { AssessmentNavigationProvider } from "@/contexts/AssessmentNavigationContext";
import RiskAssessmentForm from "@/components/RiskAssessmentForm";
import RightSidePanel from "@/components/panels/RightSidePanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <FormProvider>
        <CollaborationProvider>
          <AssessmentNavigationProvider>
            <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
              <RiskAssessmentForm />
            </div>
            <RightSidePanel />
          </AssessmentNavigationProvider>
        </CollaborationProvider>
      </FormProvider>
    </div>
  );
};

export default Index;
