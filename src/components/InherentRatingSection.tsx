
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Clock, Plus } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import HistoricalAssessmentsDialog from "./HistoricalAssessmentsDialog";
import EditableGrid, { EditableGridColumn } from "@/components/ui/editable-grid";

type InherentFactor = {
  id: string;
  name: string;
  value: string;
  weighting: string;
  comments: string;
};

const DEFAULT_FACTORS: InherentFactor[] = [
  { id: "1", name: "Financial Impact", value: "4", weighting: "25", comments: "Significant financial penalties could be imposed" },
  { id: "2", name: "Reputational Impact", value: "3", weighting: "25", comments: "Media coverage and customer trust issues" },
  { id: "3", name: "Operational Impact", value: "2", weighting: "25", comments: "Some processes would need revision" },
  { id: "4", name: "Regulatory Impact", value: "5", weighting: "25", comments: "Direct violation of key regulations" },
];

type InherentRatingSectionProps = {
  onNext: () => void;
  showWeights: boolean;
  previousFactors?: InherentFactor[];
  previousScore?: string;
  previousDate?: string;
};

const InherentRatingSection = ({ 
  onNext, 
  showWeights, 
  previousFactors = [],
  previousScore = "0.0",
  previousDate = "",
}: InherentRatingSectionProps) => {
  const [factors, setFactors] = useState<InherentFactor[]>(DEFAULT_FACTORS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.inherentRatingScore || "0.0");
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showPreviousAssessment, setShowPreviousAssessment] = useState(true);

  const handleFactorsChange = (updatedFactors: InherentFactor[]) => {
    setFactors(updatedFactors);
    updateForm({ inherentFactors: updatedFactors });
    calculateScore(updatedFactors);
  };

  const handleAddFactor = () => {
    const newId = (factors.length + 1).toString();
    const newFactors = [
      ...factors,
      { id: newId, name: "", value: "", weighting: "0", comments: "" }
    ];
    setFactors(newFactors);
    updateForm({ inherentFactors: newFactors });
  };

  const handleRemoveFactor = (index: number) => {
    if (factors.length <= 1) return;
    
    const newFactors = factors.filter((_, i) => i !== index);
    setFactors(newFactors);
    updateForm({ inherentFactors: newFactors });
    calculateScore(newFactors);
  };

  const calculateScore = (factorsList: InherentFactor[]) => {
    let total = 0;
    let weightSum = 0;
    
    factorsList.forEach(factor => {
      if (factor.value && factor.weighting) {
        total += Number(factor.value) * (Number(factor.weighting) / 100);
        weightSum += Number(factor.weighting);
      }
    });
    
    const score = weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
    setOverallScore(score);
    updateForm({ inherentRatingScore: score });
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

  const getCellColor = (value: string) => {
    const numValue = parseInt(value || "0");
    if (numValue >= 4) return "bg-red-50 text-red-600";
    if (numValue >= 3) return "bg-orange-50 text-orange-600";
    if (numValue >= 2) return "bg-yellow-50 text-yellow-600";
    return "bg-green-50 text-green-600";
  };

  const toggleWeights = () => {
    setLocalShowWeights(!localShowWeights);
    updateForm({ showWeights: !localShowWeights });
  };

  const copyFromPrevious = () => {
    if (previousFactors && previousFactors.length > 0) {
      setFactors(previousFactors);
      updateForm({ inherentFactors: previousFactors });
      calculateScore(previousFactors);
    }
  };

  const handleCopyHistoricalAssessment = (assessment: any) => {
    if (assessment && assessment.inherentFactors && assessment.inherentFactors.length > 0) {
      setFactors(assessment.inherentFactors);
      updateForm({ inherentFactors: assessment.inherentFactors });
      calculateScore(assessment.inherentFactors);
    }
  };

  // Define columns for the editable grid
  const getFactorColumns = (): EditableGridColumn[] => {
    const columns: EditableGridColumn[] = [
      {
        field: "name",
        header: "Factor Name",
        width: "25%",
        editable: true,
        type: "text"
      },
      {
        field: "value",
        header: "Rating",
        width: "15%",
        editable: true,
        type: "select",
        options: [
          { value: "1", label: "Very Low (1)", className: "text-green-500" },
          { value: "2", label: "Low (2)", className: "text-yellow-500" },
          { value: "3", label: "Medium (3)", className: "text-orange-500" },
          { value: "4", label: "High (4)", className: "text-red-500" },
          { value: "5", label: "Very High (5)", className: "text-red-600 font-semibold" }
        ],
        cellClassName: (value) => getCellColor(value)
      }
    ];
    
    if (localShowWeights) {
      columns.push({
        field: "weighting",
        header: "Weight (%)",
        width: "15%",
        editable: true,
        type: "number"
      });
    }
    
    columns.push({
      field: "comments",
      header: "Comments",
      editable: true,
      type: "textarea"
    });
    
    return columns;
  };

  // Define columns for the previous assessment grid view
  const getPreviousFactorColumns = (): EditableGridColumn[] => {
    const columns: EditableGridColumn[] = [
      {
        field: "name",
        header: "Factor Name",
        width: "25%"
      },
      {
        field: "value",
        header: "Rating",
        width: "15%",
        type: "rating"
      }
    ];
    
    if (localShowWeights) {
      columns.push({
        field: "weighting",
        header: "Weight (%)",
        width: "15%"
      });
    }
    
    columns.push({
      field: "comments",
      header: "Comments"
    });
    
    return columns;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h2 className="text-xl font-medium text-blue-800 mb-2">Inherent Risk Rating</h2>
        <p className="text-blue-700 text-sm">Assess the initial impact of the risk before any controls are applied.</p>
      </div>
      
      {previousFactors && previousFactors.length > 0 && (
        <Collapsible 
          open={showPreviousAssessment} 
          onOpenChange={setShowPreviousAssessment}
          className="border rounded-md overflow-hidden"
        >
          <div className="bg-slate-50 p-3 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500" />
              <h3 className="font-medium text-slate-700">Previous Assessment</h3>
              <Badge variant="outline" className="text-xs">
                {previousDate}
              </Badge>
              <Badge className={getScoreColor(previousScore)}>
                Score: {previousScore} ({getScoreLabel(previousScore)})
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyFromPrevious}
                className="flex items-center gap-1"
              >
                <Copy size={14} />
                <span>Copy Values</span>
              </Button>
              
              <HistoricalAssessmentsDialog 
                historicalAssessments={formState.historicalAssessments}
                onCopyAssessment={handleCopyHistoricalAssessment}
              />
              
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {showPreviousAssessment ? "Hide" : "Show"}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="p-4 space-y-4 bg-white">
              <EditableGrid
                columns={getPreviousFactorColumns()}
                data={previousFactors}
                onDataChange={() => {}}
                keyField="id"
                allowBulkEdit={false}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700">Overall Inherent Risk Rating</h3>
          <p className="text-sm text-slate-500">Calculated based on weighted factors</p>
        </div>
        <div className="flex items-center gap-4">
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
      
      <div className="space-y-4">
        <EditableGrid
          columns={getFactorColumns()}
          data={factors}
          onDataChange={handleFactorsChange}
          keyField="id"
          onAddRow={handleAddFactor}
          onRemoveRow={handleRemoveFactor}
          allowBulkEdit={true}
        />
        
        <div className="flex justify-between mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddFactor}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Factor
          </Button>
          
          <Button onClick={onNext}>Continue to Control Effectiveness</Button>
        </div>
      </div>
    </div>
  );
};

export default InherentRatingSection;
