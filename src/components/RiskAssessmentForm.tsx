
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import MainFormSection from "@/components/MainFormSection";
import InherentRatingSection from "@/components/InherentRatingSection";
import ControlEffectivenessSection from "@/components/ControlEffectivenessSection";
import ResidualRatingSection from "@/components/ResidualRatingSection";
import IssuesSection from "@/components/IssuesSection";
import CommentsAttachmentsSection from "@/components/CommentsAttachmentsSection";
import TreatmentSection from "@/components/TreatmentSection";
import RiskHeatMapSection from "@/components/RiskHeatMapSection";
import FormHeader from "@/components/FormHeader";
import RiskAssessmentNavigation from "@/components/RiskAssessmentNavigation";
import RiskAssessmentFooter from "@/components/RiskAssessmentFooter";
import MetricsAndLossesSection from "./MetricsAndLossesSection";
import { useRiskAssessment } from "@/hooks/useRiskAssessment";
import { useForm } from "@/contexts/FormContext";

const RiskAssessmentForm = () => {
  const {
    activeTab,
    setActiveTab,
    showHeatMap,
    setShowHeatMap,
    handleSubmit,
    navigateToNextRiskAssessment,
    navigateToPreviousRiskAssessment
  } = useRiskAssessment();
  
  const { formState } = useForm();

  const handleNext = () => {
    const tabOrder = ["general", "inherent", "control", "residual", "treatment", "metrics", "issues", "comments"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else {
      navigateToNextRiskAssessment();
    }
  };

  const handlePrevious = () => {
    const tabOrder = ["general", "inherent", "control", "residual", "treatment", "metrics", "issues", "comments"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    } else {
      navigateToPreviousRiskAssessment();
    }
  };

  return (
    <div className="container mx-auto pb-6">
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b pb-3">
          <FormHeader />
        </CardHeader>
        
        <div className="bg-white p-4 border-b sticky top-0 z-10 shadow-sm">
          <Collapsible 
            open={showHeatMap} 
            onOpenChange={setShowHeatMap}
            className="border rounded-md overflow-hidden bg-white mb-3"
          >
            <CollapsibleContent>
              <div className="p-3">
                <RiskHeatMapSection 
                  inherentScore={formState.inherentRatingScore} 
                  residualScore={formState.residualRatingScore}
                  previousInherentScore={formState.previousInherentRatingScore}
                  previousResidualScore={formState.previousResidualRatingScore}
                  riskName={formState.risk}
                  compact={true}
                  onNext={() => {}}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        <CardContent className="p-0">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <RiskAssessmentNavigation />
            
            <div className="p-6">
              <TabsContent value="general">
                <MainFormSection onNext={handleNext} />
              </TabsContent>
              
              <TabsContent value="inherent">
                <InherentRatingSection onNext={handleNext} showWeights={true} />
              </TabsContent>
              
              <TabsContent value="control">
                <ControlEffectivenessSection onNext={handleNext} showWeights={true} />
              </TabsContent>
              
              <TabsContent value="residual">
                <ResidualRatingSection onNext={handleNext} showWeights={true} />
              </TabsContent>
              
              <TabsContent value="treatment">
                <TreatmentSection onNext={handleNext} />
              </TabsContent>
              
              <TabsContent value="metrics">
                <MetricsAndLossesSection />
              </TabsContent>
              
              <TabsContent value="issues">
                <IssuesSection onNext={handleNext} />
              </TabsContent>
              
              <TabsContent value="comments">
                <CommentsAttachmentsSection />
              </TabsContent>
            </div>
          </Tabs>
          
          <RiskAssessmentFooter 
            activeTab={activeTab}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentForm;
