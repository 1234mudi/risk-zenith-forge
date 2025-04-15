import { useState } from "react";
import { FactorProps, FactorType } from "@/types/control-types";
import { useForm } from "@/contexts/FormContext";

export interface UseResidualRatingProps {
  showWeights: boolean;
}

export const useResidualRating = ({ showWeights }: UseResidualRatingProps) => {
  const [factors, setFactors] = useState<FactorProps[]>(DEFAULT_IMPACT_FACTORS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.residualRatingScore || "0.0");
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showTrendChart, setShowTrendChart] = useState(false);

  const handleAddFactor = (parentId: string) => {
    if (!parentId) {
      const newId = `parent-${factors.length + 1}`;
      setFactors([...factors, {
        id: newId,
        name: "",
        description: "",
        type: "parent" as FactorType,
        children: []
      }]);
    } else {
      const updatedFactors = factors.map(factor => {
        if (factor.id === parentId) {
          const childId = `${parentId}-child-${(factor.children?.length || 0) + 1}`;
          return {
            ...factor,
            children: [
              ...(factor.children || []),
              {
                id: childId,
                name: "",
                description: "",
                type: "child" as FactorType,
                value: "",
                weighting: "0",
                comments: ""
              }
            ]
          };
        }
        return factor;
      });
      setFactors(updatedFactors);
    }
  };

  const handleRemoveFactor = (parentId: string, childId?: string) => {
    if (!childId) {
      setFactors(factors.filter(f => f.id !== parentId));
    } else {
      const updatedFactors = factors.map(factor => {
        if (factor.id === parentId && factor.children) {
          return {
            ...factor,
            children: factor.children.filter(child => child.id !== childId)
          };
        }
        return factor;
      });
      setFactors(updatedFactors);
    }
    
    calculateScore();
  };

  const handleFactorChange = (parentId: string, field: keyof FactorProps, value: any, childId?: string) => {
    const updatedFactors = factors.map(factor => {
      if (factor.id === parentId) {
        if (childId && factor.children) {
          return {
            ...factor,
            children: factor.children.map(child => 
              child.id === childId ? { ...child, [field]: value } : child
            )
          };
        } else {
          return { ...factor, [field]: value };
        }
      }
      return factor;
    });
    
    setFactors(updatedFactors);
    updateForm({ residualFactors: getAllChildFactors(updatedFactors) });
    calculateScore(updatedFactors);
  };

  const getAllChildFactors = (factorsList = factors) => {
    return factorsList.flatMap(parent => parent.children || []);
  };

  const calculateScore = (factorsList = factors) => {
    const allChildFactors = getAllChildFactors(factorsList);
    
    if (allChildFactors.length > 0) {
      let total = 0;
      let weightSum = 0;
      
      allChildFactors.forEach(factor => {
        if (factor.value && factor.weighting) {
          total += Number(factor.value) * (Number(factor.weighting) / 100);
          weightSum += Number(factor.weighting);
        }
      });
      
      const score = weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
      setOverallScore(score);
      updateForm({ residualRatingScore: score });
    }
  };

  const copyFromPrevious = () => {
    if (SAMPLE_HISTORICAL_ASSESSMENTS.length > 0) {
      const latestAssessment = SAMPLE_HISTORICAL_ASSESSMENTS[0];
      const previousFactorStructure = [{
        id: "impact",
        name: "Impact",
        description: "Overall impact assessment",
        type: "parent" as FactorType,
        children: latestAssessment.factors.map(factor => ({
          ...factor,
          type: "child" as FactorType
        }))
      }];
      
      setFactors(previousFactorStructure);
      updateForm({ 
        residualFactors: latestAssessment.factors.map(factor => ({
          ...factor,
          type: "child" as FactorType
        }))
      });
      setOverallScore(latestAssessment.score);
      updateForm({ residualRatingScore: latestAssessment.score });
    }
  };

  const toggleWeights = () => {
    setLocalShowWeights(!localShowWeights);
    updateForm({ showWeights: !localShowWeights });
  };

  return {
    factors,
    overallScore,
    localShowWeights,
    showTrendChart,
    setShowTrendChart,
    handleAddFactor,
    handleRemoveFactor,
    handleFactorChange,
    copyFromPrevious,
    toggleWeights,
    getAllChildFactors
  };
};

const DEFAULT_IMPACT_FACTORS: FactorProps[] = [
  {
    id: "impact",
    name: "Impact",
    description: "Overall impact assessment",
    type: "parent",
    children: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "2",
        weighting: "30",
        comments: "Reduced financial impact due to control improvements"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "2",
        weighting: "25",
        comments: "Improved reputational positioning with effective KYC controls"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "2",
        weighting: "20",
        comments: "Moderate operational impact with improved processes"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Some ongoing regulatory concerns that require attention"
      }
    ]
  }
];

export const SAMPLE_HISTORICAL_ASSESSMENTS = [
  {
    date: "2024-03-15",
    score: "2.1",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "2",
        weighting: "30",
        comments: "Reduced financial impact due to control improvements"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "2",
        weighting: "25",
        comments: "Improved reputational positioning with effective KYC controls"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "2",
        weighting: "20",
        comments: "Moderate operational impact with improved processes"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Some ongoing regulatory concerns that require attention"
      }
    ]
  },
  {
    date: "2023-12-10",
    score: "2.4",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "2",
        weighting: "30",
        comments: "Low financial impact with mitigations"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Medium reputational concerns"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "2",
        weighting: "20",
        comments: "Minimal operational impact"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Some regulatory challenges"
      }
    ]
  },
  {
    date: "2023-09-05",
    score: "2.8",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "3",
        weighting: "30",
        comments: "Medium financial impact"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Some reputational issues"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "2",
        weighting: "20",
        comments: "Minor operational challenges"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Regulatory concerns being addressed"
      }
    ]
  },
  {
    date: "2023-06-20",
    score: "3.0",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "3",
        weighting: "30",
        comments: "Medium financial exposure"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Medium reputational risks"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "3",
        weighting: "20",
        comments: "Some operational disruptions"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Ongoing regulatory concerns"
      }
    ]
  },
  {
    date: "2023-03-12",
    score: "3.2",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "3",
        weighting: "30",
        comments: "Moderate financial impacts"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "3",
        weighting: "25",
        comments: "Medium reputation concerns"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "3",
        weighting: "20",
        comments: "Medium operational issues"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Significant regulatory challenges"
      }
    ]
  }
];
