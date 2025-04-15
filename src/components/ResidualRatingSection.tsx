import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, LineChart, Eye, EyeOff } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FactorProps, FactorType } from "@/types/control-types";
import PreviousAssessmentsSection from "./PreviousAssessmentsSection";

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

const SAMPLE_HISTORICAL_ASSESSMENTS = [
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

type ResidualRatingSectionProps = {
  onNext: () => void;
  showWeights: boolean;
};

const ResidualRatingSection = ({ 
  onNext, 
  showWeights
}: ResidualRatingSectionProps) => {
  const [factors, setFactors] = useState<FactorProps[]>(DEFAULT_IMPACT_FACTORS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.residualRatingScore || "0.0");
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
        type: "parent" as const,
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
                type: "child" as const,
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
        residualFactors: latestAssessment.factors.map(factor => ({
          ...factor,
          type: "child" as FactorType
        }))
      });
      setOverallScore(latestAssessment.score);
      updateForm({ residualRatingScore: latestAssessment.score });
    }
  };

  return (
    <div className="space-y-6">
      <PreviousAssessmentsSection
        title="Previous Residual Risk Assessments"
        assessmentHistory={assessmentHistory}
        factors={SAMPLE_HISTORICAL_ASSESSMENTS[0]?.factors}
        showWeights={localShowWeights}
        onCopyLatest={copyFromPrevious}
        getScoreColor={getScoreColor}
        getScoreLabel={getScoreLabel}
        getRatingColor={getRatingColor}
        type="residual"
      />
      
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700">Overall Residual Risk Rating</h3>
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
            {showTrendChart ? "Hide Residual Trend" : "Show Residual Trend"}
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
          <div className="h-64 flex items-center justify-center border rounded">
            <LineChart className="h-6 w-6 text-slate-300" />
            <span className="ml-2 text-slate-500">Residual Risk Trend Chart Placeholder</span>
          </div>
        </Card>
      )}
      
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Factor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Rating</TableHead>
              {localShowWeights && <TableHead>Weight (%)</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factors.map((parentFactor) => (
              <React.Fragment key={parentFactor.id}>
                <TableRow className="bg-blue-50">
                  <TableCell colSpan={localShowWeights ? 5 : 4} className="font-medium py-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Input 
                          value={parentFactor.name}
                          onChange={(e) => handleFactorChange(parentFactor.id, "name", e.target.value)}
                          className="font-medium border-blue-200"
                          placeholder="Parent Factor Name"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddFactor(parentFactor.id)}
                        className="flex items-center gap-1"
                      >
                        <PlusCircle className="h-4 w-4" /> Add Child Factor
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {parentFactor.children?.map((factor) => (
                  <TableRow key={factor.id}>
                    <TableCell>
                      <Input 
                        value={factor.name}
                        onChange={(e) => handleFactorChange(parentFactor.id, "name", e.target.value, factor.id)}
                        placeholder="Factor name"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={factor.description}
                        onChange={(e) => handleFactorChange(parentFactor.id, "description", e.target.value, factor.id)}
                        placeholder="Description"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={factor.value}
                          onValueChange={(value) => handleFactorChange(parentFactor.id, "value", value, factor.id)}
                        >
                          <SelectTrigger className={`w-full ${getCellColor(factor.value || "0")}`}>
                            <SelectValue placeholder="Rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1" className="text-green-500">Very Low (1)</SelectItem>
                            <SelectItem value="2" className="text-yellow-500">Low (2)</SelectItem>
                            <SelectItem value="3" className="text-orange-500">Medium (3)</SelectItem>
                            <SelectItem value="4" className="text-red-500">High (4)</SelectItem>
                            <SelectItem value="5" className="text-red-600 font-semibold">Very High (5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    {localShowWeights && (
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={factor.weighting}
                          onChange={(e) => handleFactorChange(parentFactor.id, "weighting", e.target.value, factor.id)}
                          className="w-full"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              Comments
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Comments for {factor.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <Textarea
                                value={factor.comments}
                                onChange={(e) => handleFactorChange(parentFactor.id, "comments", e.target.value, factor.id)}
                                className="min-h-[100px]"
                                placeholder="Add your comments here..."
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFactor(parentFactor.id, factor.id)}
                          className="text-red-500 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Treatment</Button>
      </div>
    </div>
  );
};

export default ResidualRatingSection;
