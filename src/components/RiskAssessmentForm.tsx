
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import InherentRatingSection from "@/components/InherentRatingSection";
import ControlEffectivenessSection from "@/components/ControlEffectivenessSection";
import ResidualRatingSection from "@/components/ResidualRatingSection";
import IssuesSection from "@/components/IssuesSection";
import RiskHeatMapSection from "@/components/RiskHeatMapSection";
import FormHeader from "@/components/FormHeader";
import RiskAssessmentNavigation from "@/components/RiskAssessmentNavigation";
import RiskAssessmentFooter from "@/components/RiskAssessmentFooter";
import NextSectionCallout from "@/components/NextSectionCallout";
import ChallengeNotificationBanner from "@/components/review/ChallengeNotificationBanner";
import { useRiskAssessment } from "@/hooks/useRiskAssessment";
import { useForm } from "@/contexts/FormContext";

const RiskAssessmentForm = () => {
  const {
    activeTab,
    setActiveTab,
    handleSubmit,
    navigateToNextRiskAssessment,
    navigateToPreviousRiskAssessment
  } = useRiskAssessment();
  
  const { formState, dismissChallenge } = useForm();

  const handleNext = () => {
    const tabOrder = ["inherent", "control", "residual", "heatmap", "issues"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else {
      navigateToNextRiskAssessment();
    }
  };

  const handlePrevious = () => {
    const tabOrder = ["inherent", "control", "residual", "heatmap", "issues"];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    } else {
      navigateToPreviousRiskAssessment();
    }
  };

  return (
    <div className="container mx-auto pb-4 pr-14">
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b py-3 px-4">
          <FormHeader />
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="inherent" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <RiskAssessmentNavigation />
            
            <div className="px-4 pt-3">
              <ChallengeNotificationBanner 
                challenge={formState.challengeDetails}
                onDismiss={dismissChallenge}
              />
              <NextSectionCallout activeTab={activeTab} onNavigate={setActiveTab} />
            </div>
            
            <div className="p-4">
              <TabsContent value="inherent">
                <InherentRatingSection onNext={handleNext} showWeights={true} />
              </TabsContent>
              
              <TabsContent value="control">
                <ControlEffectivenessSection onNext={handleNext} showWeights={true} />
              </TabsContent>
              
              <TabsContent value="residual">
                <ResidualRatingSection onNext={handleNext} showWeights={true} />
              </TabsContent>
              
              <TabsContent value="heatmap">
                <RiskHeatMapSection 
                  inherentScore={formState.inherentRatingScore} 
                  residualScore={formState.residualRatingScore}
                  previousInherentScore={formState.previousInherentRatingScore}
                  previousResidualScore={formState.previousResidualRatingScore}
                  riskName={formState.risk}
                  compact={false}
                  onNext={handleNext}
                />
              </TabsContent>
              
              <TabsContent value="issues">
                <IssuesSection onNext={handleNext} />
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
