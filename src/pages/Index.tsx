
import React from "react";
import { FormProvider } from "@/contexts/FormContext";
import RiskAssessmentForm from "@/components/RiskAssessmentForm";
import RiskOutlierMetrics from "@/components/RiskOutlierMetrics";
import RiskLossMetrics from "@/components/RiskLossMetrics";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <FormProvider>
        <div className="container mx-auto py-6 px-4 max-w-7xl flex flex-col lg:flex-row gap-4">
          <div className="flex-grow">
            <RiskAssessmentForm />
          </div>
          <div className="lg:w-80 space-y-4">
            <RiskOutlierMetrics />
            <RiskLossMetrics />
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default Index;
