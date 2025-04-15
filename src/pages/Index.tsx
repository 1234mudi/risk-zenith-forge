
import React from "react";
import { FormProvider } from "@/contexts/FormContext";
import RiskAssessmentForm from "@/components/RiskAssessmentForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <FormProvider>
        <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
          <RiskAssessmentForm />
        </div>
      </FormProvider>
    </div>
  );
};

export default Index;
