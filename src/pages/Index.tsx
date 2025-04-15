
import React from "react";
import { FormProvider } from "@/contexts/FormContext";
import RiskAssessmentForm from "@/components/RiskAssessmentForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <FormProvider>
        <RiskAssessmentForm />
      </FormProvider>
    </div>
  );
};

export default Index;
