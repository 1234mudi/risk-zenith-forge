
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
import { ChevronRight, ChevronLeft, BarChart, BarChart2, LayoutDashboard } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock list of risk assessments for navigation
const MOCK_RISK_ASSESSMENTS = [
  { 
    id: "RA-2025-0001", 
    risk: "KYC Risk Assessment Inadequacy", 
    eraId: "ERA-7752",
    organization: "Global Banking Corp",
    assessableItem: "Customer Due Diligence",
    riskHierarchy: "Compliance Risk > Regulatory Risk > KYC Risk",
    inherentRatingScore: "3.5",
    controlEffectivenessScore: "2.5",
    residualRatingScore: "2.0"
  },
  { 
    id: "RA-2025-0002", 
    risk: "AML Transaction Monitoring Gaps", 
    eraId: "ERA-7753",
    organization: "Global Banking Corp",
    assessableItem: "Transaction Monitoring Systems",
    riskHierarchy: "Compliance Risk > AML Risk > Monitoring Risk",
    inherentRatingScore: "4.1",
    controlEffectivenessScore: "3.2",
    residualRatingScore: "2.8"
  },
  { 
    id: "RA-2025-0003", 
    risk: "Insufficient Sanctions Screening", 
    eraId: "ERA-7754",
    organization: "Global Banking Corp",
    assessableItem: "International Payments",
    riskHierarchy: "Compliance Risk > Sanctions Risk > Screening Risk",
    inherentRatingScore: "4.5",
    controlEffectivenessScore: "3.8",
    residualRatingScore: "3.2"
  },
  { 
    id: "RA-2025-0004", 
    risk: "Data Privacy Violations", 
    eraId: "ERA-7755",
    organization: "Global Banking Corp",
    assessableItem: "Customer Data Management",
    riskHierarchy: "Operational Risk > Data Risk > Privacy Risk",
    inherentRatingScore: "3.9",
    controlEffectivenessScore: "2.3",
    residualRatingScore: "2.4"
  },
];

const RiskAssessmentForm = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const { formState, updateForm } = useForm();
  const [currentRiskIndex, setCurrentRiskIndex] = useState(0);
  const [showHeatMap, setShowHeatMap] = useState(false);

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
    if (numScore >= 4) return "bg-red-600 text-white border-red-700";
    if (numScore >= 3) return "bg-orange-500 text-white border-orange-600";
    if (numScore >= 2) return "bg-yellow-500 text-white border-yellow-600";
    return "bg-green-500 text-white border-green-600";
  };

  const getScoreLabel = (score) => {
    const numScore = parseFloat(score || 0);
    if (numScore >= 4) return "High";
    if (numScore >= 3) return "Medium";
    if (numScore >= 2) return "Low";
    return "Very Low";
  };

  const tabOrder = ["general", "inherent", "control", "residual", "treatment", "issues", "comments"];

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else {
      // Navigate to next risk assessment
      navigateToNextRiskAssessment();
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    } else {
      // Navigate to previous risk assessment
      navigateToPreviousRiskAssessment();
    }
  };

  const navigateToNextRiskAssessment = () => {
    const nextIndex = (currentRiskIndex + 1) % MOCK_RISK_ASSESSMENTS.length;
    setCurrentRiskIndex(nextIndex);
    loadRiskAssessment(nextIndex);
  };

  const navigateToPreviousRiskAssessment = () => {
    const prevIndex = (currentRiskIndex - 1 + MOCK_RISK_ASSESSMENTS.length) % MOCK_RISK_ASSESSMENTS.length;
    setCurrentRiskIndex(prevIndex);
    loadRiskAssessment(prevIndex);
  };

  const loadRiskAssessment = (index) => {
    const riskData = MOCK_RISK_ASSESSMENTS[index];
    
    // Update form with new risk data
    updateForm({
      referenceId: riskData.id,
      risk: riskData.risk,
      eraId: riskData.eraId,
      organization: riskData.organization,
      assessableItem: riskData.assessableItem,
      riskHierarchy: riskData.riskHierarchy,
      inherentRatingScore: riskData.inherentRatingScore,
      controlEffectivenessScore: riskData.controlEffectivenessScore,
      residualRatingScore: riskData.residualRatingScore
    });
    
    // Reset to first tab
    setActiveTab("general");
    
    toast({
      title: "Risk Assessment Changed",
      description: `Now viewing ${riskData.risk}`,
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <Card className="shadow-md">
        <CardHeader className="bg-slate-50 border-b pb-3">
          <FormHeader />
        </CardHeader>
        
        <div className="bg-white p-4 border-b sticky top-0 z-10 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
            <RiskSummary 
              inherentScore={formState.inherentRatingScore} 
              controlScore={formState.controlEffectivenessScore}
              residualScore={formState.residualRatingScore}
              getScoreColor={getScoreColor}
              getScoreLabel={getScoreLabel}
            />
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHeatMap(!showHeatMap)}
                className="flex items-center gap-1"
              >
                <BarChart2 className="h-4 w-4" />
                {showHeatMap ? "Hide Heat Map" : "Show Heat Map"}
              </Button>
              
              <ScopeSharingRisks />
            </div>
          </div>
          
          {/* Heat Map Collapsible */}
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
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
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
          
          <div className="flex justify-between p-5 gap-4 border-t mt-4">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {activeTab === tabOrder[0] ? "Previous Risk" : "Previous"}
            </Button>
            
            <div>
              {activeTab === tabOrder[tabOrder.length - 1] && (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 mr-2">
                  Submit Assessment
                </Button>
              )}
              
              <Button 
                onClick={handleNext} 
                className="flex items-center"
              >
                {activeTab === tabOrder[tabOrder.length - 1] ? "Next Risk" : "Next"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentForm;
