import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "@/contexts/FormContext";

export const MOCK_RISK_ASSESSMENTS = [
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

export const useRiskAssessment = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [currentRiskIndex, setCurrentRiskIndex] = useState(0);
  const [showHeatMap, setShowHeatMap] = useState(false);
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

  const loadRiskAssessment = (index: number) => {
    const riskData = MOCK_RISK_ASSESSMENTS[index];
    
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
    
    setActiveTab("general");
  };

  return {
    activeTab,
    setActiveTab,
    showHeatMap,
    setShowHeatMap,
    handleSubmit,
    navigateToNextRiskAssessment,
    navigateToPreviousRiskAssessment,
    currentRiskIndex
  };
};
