import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LineChart, Eye, EyeOff } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Card } from "@/components/ui/card";
import { FactorProps, FactorType } from "@/types/control-types";
import PreviousAssessmentsSection from "./PreviousAssessmentsSection";
import EditableGrid, { EditableGridColumn } from "@/components/ui/editable-grid";
import RiskTrendChart from "./charts/RiskTrendChart";

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
        value: "3",
        weighting: "30",
        comments: "Significant financial impact due to penalties and remediation costs"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Major reputational damage if regulatory issues become public"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "3",
        weighting: "20",
        comments: "Operational disruptions due to compliance remediation activities"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "High regulatory scrutiny and potential for enforcement actions"
      }
    ]
  }
];

const SAMPLE_HISTORICAL_ASSESSMENTS = [
  {
    date: "2024-03-15",
    score: "3.7",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "3",
        weighting: "30",
        comments: "Significant financial impact due to penalties and remediation costs"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Major reputational damage if regulatory issues become public"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "3",
        weighting: "20",
        comments: "Operational disruptions due to compliance remediation activities"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "High regulatory scrutiny and potential for enforcement actions"
      }
    ]
  },
  {
    date: "2023-12-10",
    score: "3.9",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "4",
        weighting: "30",
        comments: "Very high financial impact due to penalties"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Major reputational damage if issues become public"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "3",
        weighting: "20",
        comments: "Moderate operational disruptions"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "High regulatory scrutiny"
      }
    ]
  },
  {
    date: "2023-09-05",
    score: "3.5",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "3",
        weighting: "30",
        comments: "Moderate financial impact"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Significant reputational concerns"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "3",
        weighting: "20",
        comments: "Some operational challenges"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Increasing regulatory attention"
      }
    ]
  },
  {
    date: "2023-06-20",
    score: "4.0",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "4",
        weighting: "30",
        comments: "High financial impact from fines"
      },
      {
        id: "2",
        name: "Reputational Impact",
        description: "Impact on brand and reputation",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Severe reputational risks identified"
      },
      {
        id: "3",
        name: "Operational Impact",
        description: "Impact on day-to-day operations",
        type: "child",
        value: "4",
        weighting: "20",
        comments: "Significant operational disruptions"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Critical regulatory issues"
      }
    ]
  },
  {
    date: "2023-03-12",
    score: "3.8",
    factors: [
      {
        id: "1",
        name: "Financial Impact",
        description: "Impact on financial performance",
        type: "child",
        value: "4",
        weighting: "30",
        comments: "High financial exposure"
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
        value: "4",
        weighting: "20",
        comments: "Serious operational challenges"
      },
      {
        id: "4",
        name: "Regulatory Impact",
        description: "Impact related to regulatory oversight",
        type: "child",
        value: "4",
        weighting: "25",
        comments: "Ongoing regulatory issues"
      }
    ]
  }
];

type InherentRatingSectionProps = {
  onNext: () => void;
  showWeights: boolean;
};

const InherentRatingSection = ({ 
  onNext, 
  showWeights
}: InherentRatingSectionProps) => {
  const [factors, setFactors] = useState<FactorProps[]>(DEFAULT_IMPACT_FACTORS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.inherentRatingScore || "0.0");
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showTrendChart, setShowTrendChart] = useState(false);
  
  const assessmentHistory = SAMPLE_HISTORICAL_ASSESSMENTS.map(assessment => ({
    date: assessment.date,
    score: assessment.score
  }));

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
    updateForm({ inherentFactors: getAllChildFactors(updatedFactors) });
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
      updateForm({ inherentRatingScore: score });
    }
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score || "0");
    if (numScore >= 4) return "bg-red-100 text-red-700 border-red-200";
    if (numScore >= 3) return "bg-orange-100 text-orange-700 border-orange-200";
    if (numScore >= 2) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getScoreLabel = (score: string) => {
    const numScore = parseFloat(score || "0");
    if (numScore >= 4) return "High";
    if (numScore >= 3) return "Medium";
    if (numScore >= 2) return "Low";
    return "Very Low";
  };

  const getRatingColor = (value: string) => {
    const numValue = parseInt(value || "0");
    if (numValue >= 4) return "text-red-600 bg-red-50 px-2 py-1 rounded";
    if (numValue >= 3) return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
    if (numValue >= 2) return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
    return "text-green-600 bg-green-50 px-2 py-1 rounded";
  };

  const getCellColor = (value: string) => {
    const numValue = parseInt(value || "0");
    if (numValue >= 4) return "bg-red-50";
    if (numValue >= 3) return "bg-orange-50";
    if (numValue >= 2) return "bg-yellow-50";
    return "bg-green-50";
  };

  const toggleWeights = () => {
    setLocalShowWeights(!localShowWeights);
    updateForm({ showWeights: !localShowWeights });
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
        inherentFactors: latestAssessment.factors.map(factor => ({
          ...factor,
          type: "child" as FactorType
        }))
      });
      setOverallScore(latestAssessment.score);
      updateForm({ inherentRatingScore: latestAssessment.score });
    }
  };

  const gridData = factors.flatMap(parent => 
    parent.children?.map(child => ({
      ...child,
      parentId: parent.id
    })) || []
  );

  const columns: EditableGridColumn[] = [
    {
      field: "name",
      header: "Factor",
      editable: true,
      type: "text"
    },
    {
      field: "description",
      header: "Description",
      editable: true,
      type: "text"
    },
    {
      field: "value",
      header: "Rating",
      editable: true,
      type: "select",
      options: [
        { value: "1", label: "Very Low (1)", className: "text-green-500 bg-green-50" },
        { value: "2", label: "Low (2)", className: "text-yellow-500 bg-yellow-50" },
        { value: "3", label: "Medium (3)", className: "text-orange-500 bg-orange-50" },
        { value: "4", label: "High (4)", className: "text-red-500 bg-red-50" },
        { value: "5", label: "Very High (5)", className: "text-red-600 bg-red-50 font-semibold" }
      ]
    },
    {
      field: "comments",
      header: "Comments",
      editable: true,
      type: "textarea"
    }
  ];

  if (localShowWeights) {
    columns.splice(3, 0, {
      field: "weighting",
      header: "Factor Weightage (%)",
      editable: true,
      type: "number"
    });
  }

  const handleDataChange = (newData: any[]) => {
    newData.forEach(item => {
      if (item.parentId) {
        const parent = factors.find(f => f.id === item.parentId);
        if (parent && parent.children) {
          const child = parent.children.find(c => c.id === item.id);
          if (child) {
            Object.keys(item).forEach(key => {
              if (key !== 'id' && key !== 'parentId' && child[key as keyof typeof child] !== item[key]) {
                handleFactorChange(item.parentId, key as keyof FactorProps, item[key], item.id);
              }
            });
          }
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <PreviousAssessmentsSection
        title="Previous Inherent Risk Assessments"
        assessmentHistory={assessmentHistory}
        factors={SAMPLE_HISTORICAL_ASSESSMENTS[0]?.factors.map(factor => ({
          ...factor,
          type: factor.type as FactorType
        }))}
        showWeights={localShowWeights}
        onCopyLatest={copyFromPrevious}
        getScoreColor={getScoreColor}
        getScoreLabel={getScoreLabel}
        getRatingColor={getRatingColor}
        type="inherent"
      />
      
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700">Overall Inherent Risk Rating</h3>
          <p className="text-sm text-slate-500">Calculated based on weighted impact factors</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTrendChart(!showTrendChart)}
            className="flex items-center gap-1"
          >
            <LineChart className="h-4 w-4" />
            {showTrendChart ? "Hide Inherent Trend" : "Show Inherent Trend"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleWeights}
            className="flex items-center gap-1"
          >
            {localShowWeights ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {localShowWeights ? "Hide Weights" : "Show Weights"}
          </Button>
          <div className={`px-4 py-2 rounded border ${getScoreColor(overallScore)}`}>
            <div className="text-sm font-medium">Score: {overallScore}</div>
            <div className="text-xs font-semibold">{getScoreLabel(overallScore)}</div>
          </div>
        </div>
      </div>
      
      {showTrendChart && (
        <Card className="p-4 border">
          <RiskTrendChart 
            assessments={assessmentHistory} 
            color="#f97316" // Orange color for inherent risk
            title="Inherent Risk Score"
          />
        </Card>
      )}
      
      <EditableGrid
        columns={columns}
        data={gridData}
        onDataChange={handleDataChange}
        keyField="id"
        onAddRow={() => handleAddFactor(factors[0]?.id || '')}
        onRemoveRow={(index) => {
          const item = gridData[index];
          if (item.parentId) {
            handleRemoveFactor(item.parentId, item.id);
          }
        }}
        allowBulkEdit
        className="border-collapse [&_th]:bg-yellow-50 [&_td]:border [&_th]:border [&_td]:border-slate-200 [&_th]:border-slate-200"
      />
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Control Effectiveness</Button>
      </div>
    </div>
  );
};

export default InherentRatingSection;
