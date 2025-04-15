
import React from "react";
import { FormProvider } from "@/contexts/FormContext";
import RiskAssessmentForm from "@/components/RiskAssessmentForm";
import RiskOutlierMetrics from "@/components/RiskOutlierMetrics";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <FormProvider>
        <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RiskAssessmentForm />
            </div>
            <div className="space-y-6">
              <RiskOutlierMetrics />
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default Index;
