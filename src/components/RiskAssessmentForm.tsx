
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainFormSection from "@/components/MainFormSection";
import InherentRatingSection from "@/components/InherentRatingSection";
import ControlEffectivenessSection from "@/components/ControlEffectivenessSection";
import ResidualRatingSection from "@/components/ResidualRatingSection";
import IssuesSection from "@/components/IssuesSection";
import CommentsAttachmentsSection from "@/components/CommentsAttachmentsSection";
import TreatmentSection from "@/components/TreatmentSection";
import RiskHeatMapSection from "@/components/RiskHeatMapSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/contexts/FormContext";
import RiskSummary from "@/components/RiskSummary";
import ScopeSharingRisks from "@/components/RelatedRisks";
import FormHeader from "@/components/FormHeader";
import RiskAppetiteIndicator from "@/components/RiskAppetiteIndicator";

const RiskAssessmentForm = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const { formState, updateForm } = useForm();

  useEffect(() => {
    calculateRatings();
  }, [formState.inherentFactors, formState.controls, formState.residualFactors]);

  const calculateRatings = () => {
    if (formState.inherentFactors && formState.inherentFactors.length > 0) {
      let total = 0;
      let weightSum = 0;
      
      formState.inherentFactors.forEach(factor => {
        if (factor.value && factor.weighting) {
          total += Number(factor.value) * (Number(factor.weighting) / 100);
          weightSum += Number(factor.weighting);
        }
      });
      
      const inherentScore = weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
      updateForm({ inherentRatingScore: inherentScore });
    }
    
    if (formState.controls && formState.controls.length > 0) {
      let total = 0;
      let weightSum = 0;
      
      formState.controls.forEach(control => {
        if (control.effectiveness && control.weighting) {
          total += Number(control.effectiveness) * (Number(control.weighting) / 100);
          weightSum += Number(control.weighting);
        }
      });
      
      const controlScore = weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
      updateForm({ controlEffectivenessScore: controlScore });
    }
    
    if (formState.residualFactors && formState.residualFactors.length > 0) {
      let total = 0;
      let weightSum = 0;
      
      formState.residualFactors.forEach(factor => {
        if (factor.value && factor.weighting) {
          total += Number(factor.value) * (Number(factor.weighting) / 100);
          weightSum += Number(factor.weighting);
        }
      });
      
      const residualScore = weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
      updateForm({ residualRatingScore: residualScore });
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Your risk assessment has been submitted successfully.",
    });
    console.log("Form data submitted:", formState);
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score || 0);
    if (numScore >= 4) return "text-red-600 bg-red-50";
    if (numScore >= 3) return "text-orange-600 bg-orange-50";
    if (numScore >= 2) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getScoreLabel = (score) => {
    const numScore = parseFloat(score || 0);
    if (numScore >= 4) return "High";
    if (numScore >= 3) return "Medium";
    if (numScore >= 2) return "Low";
    return "Very Low";
  };

  const tabOrder = ["general", "inherent", "control", "residual", "heatmap", "treatment", "issues", "comments"];

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b">
          <FormHeader />
        </CardHeader>
        
        <div className="bg-white p-4 border-b sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <RiskSummary 
              inherentScore={formState.inherentRatingScore} 
              controlScore={formState.controlEffectivenessScore}
              residualScore={formState.residualRatingScore}
              getScoreColor={getScoreColor}
              getScoreLabel={getScoreLabel}
            />
            
            <ScopeSharingRisks />
          </div>
        </div>
        
        <CardContent className="p-0">
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start px-6 pt-4 bg-white border-b h-auto flex-wrap">
              <TabsTrigger value="general" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                General
              </TabsTrigger>
              <TabsTrigger value="inherent" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Inherent Rating
              </TabsTrigger>
              <TabsTrigger value="control" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Control Effectiveness
              </TabsTrigger>
              <TabsTrigger value="residual" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Residual Rating
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Risk Heat Map
              </TabsTrigger>
              <TabsTrigger value="treatment" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Treatment
              </TabsTrigger>
              <TabsTrigger value="issues" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Issues
              </TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Additional Details
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="general">
                <MainFormSection onNext={handleNext} />
              </TabsContent>
              
              <TabsContent value="inherent">
                <InherentRatingSection 
                  onNext={handleNext} 
                  showWeights={formState.showWeights}
                  previousFactors={formState.previousInherentFactors}
                  previousScore={formState.previousInherentRatingScore}
                  previousDate={formState.previousAssessmentDate}
                />
              </TabsContent>
              
              <TabsContent value="control">
                <ControlEffectivenessSection 
                  onNext={handleNext} 
                  showWeights={formState.showWeights}
                  previousControls={formState.previousControls}
                  previousScore={formState.previousControlEffectivenessScore}
                  previousDate={formState.previousAssessmentDate}
                />
              </TabsContent>
              
              <TabsContent value="residual">
                <ResidualRatingSection 
                  onNext={handleNext} 
                  showWeights={formState.showWeights}
                  previousFactors={formState.previousResidualFactors}
                  previousScore={formState.previousResidualRatingScore}
                  previousDate={formState.previousAssessmentDate}
                />
              </TabsContent>
              
              <TabsContent value="heatmap">
                <RiskHeatMapSection 
                  onNext={handleNext}
                  inherentScore={formState.inherentRatingScore} 
                  residualScore={formState.residualRatingScore}
                  previousInherentScore={formState.previousInherentRatingScore}
                  previousResidualScore={formState.previousResidualRatingScore}
                  riskName={formState.risk}
                />
              </TabsContent>
              
              <TabsContent value="treatment">
                <TreatmentSection onNext={handleNext} />
              </TabsContent>
              
              <TabsContent value="issues">
                <IssuesSection onNext={handleNext} />
              </TabsContent>
              
              <TabsContent value="comments">
                <CommentsAttachmentsSection />
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex justify-end p-6 pt-2 gap-4 border-t mt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={activeTab === tabOrder[0]}>
              Previous
            </Button>
            
            {activeTab !== tabOrder[tabOrder.length - 1] ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                Submit Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentForm;
