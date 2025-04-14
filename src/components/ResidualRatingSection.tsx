
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Eye, EyeOff, Copy, Clock, AlertTriangle } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Card } from "@/components/ui/card";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import HistoricalAssessmentsDialog from "./HistoricalAssessmentsDialog";
import { useToast } from "@/hooks/use-toast";

type ResidualFactor = {
  id: string;
  name: string;
  value: string;
  weighting: string;
  comments: string;
};

const DEFAULT_FACTORS: ResidualFactor[] = [
  { id: "1", name: "Financial Impact", value: "2", weighting: "25", comments: "Controls reduce potential penalties" },
  { id: "2", name: "Reputational Impact", value: "2", weighting: "25", comments: "Proactive PR strategy in place" },
  { id: "3", name: "Operational Impact", value: "1", weighting: "25", comments: "Processes optimized" },
  { id: "4", name: "Regulatory Impact", value: "3", weighting: "25", comments: "Some compliance gaps remain" },
];

type ResidualRatingSectionProps = {
  onNext: () => void;
  showWeights: boolean;
  previousFactors?: ResidualFactor[];
  previousScore?: string;
  previousDate?: string;
};

const ResidualRatingSection = ({ 
  onNext, 
  showWeights,
  previousFactors = [],
  previousScore = "0.0",
  previousDate = "",
}: ResidualRatingSectionProps) => {
  const [factors, setFactors] = useState<ResidualFactor[]>(DEFAULT_FACTORS);
  const { updateForm, formState, addAppetiteBreachIssue } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.residualRatingScore || "0.0");
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showPreviousAssessment, setShowPreviousAssessment] = useState(true);
  const { toast } = useToast();

  const handleAddFactor = () => {
    const newId = (factors.length + 1).toString();
    setFactors([
      ...factors,
      { id: newId, name: "", value: "", weighting: "0", comments: "" }
    ]);
  };

  const handleRemoveFactor = (id: string) => {
    if (factors.length <= 1) return;
    setFactors(factors.filter(factor => factor.id !== id));
  };

  const handleFactorChange = (id: string, field: keyof ResidualFactor, value: string) => {
    const updatedFactors = factors.map(factor => 
      factor.id === id ? { ...factor, [field]: value } : factor
    );
    setFactors(updatedFactors);
    updateForm({ residualFactors: updatedFactors });
    calculateScore(updatedFactors);
  };

  const calculateScore = (factorsList: ResidualFactor[]) => {
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
    updateForm({ residualRatingScore: score });
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
    if (previousFactors && previousFactors.length > 0) {
      setFactors(previousFactors);
      updateForm({ residualFactors: previousFactors });
      calculateScore(previousFactors);
    }
  };

  const handleCopyHistoricalAssessment = (assessment: any) => {
    if (assessment && assessment.residualFactors && assessment.residualFactors.length > 0) {
      setFactors(assessment.residualFactors);
      updateForm({ residualFactors: assessment.residualFactors });
      calculateScore(assessment.residualFactors);
    }
  };

  // Check against risk appetite
  useEffect(() => {
    const residualScore = parseFloat(overallScore || "0");
    const appetiteThreshold = parseFloat(formState.riskAppetite.threshold || "0");
    const isWithinAppetite = residualScore <= appetiteThreshold;
    
    updateForm({ isWithinAppetite });
  }, [overallScore]);

  const createAppetiteBreachIssue = () => {
    const newIssue = {
      id: (formState.issues.length + 1).toString(),
      issueKey: `ISS-APP-${String(formState.issues.length + 1).padStart(3, '0')}`,
      title: "Risk Appetite Breach",
      description: `The current residual risk rating (${overallScore}) exceeds the defined risk appetite threshold (${formState.riskAppetite.threshold}). A remediation plan is required to bring the risk within appetite.`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      owner: formState.treatmentOwner,
    };
    
    addAppetiteBreachIssue(newIssue);
    
    toast({
      title: "Risk Appetite Issue Created",
      description: "A new issue has been created to address the risk appetite breach.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-md">
        <h2 className="text-xl font-medium text-green-800 mb-2">Residual Risk Rating</h2>
        <p className="text-green-700 text-sm">Assess the remaining risk after controls have been applied.</p>
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm font-medium text-slate-500 px-4">
                <div className="md:col-span-3">Factor Name</div>
                <div className="md:col-span-2">Rating</div>
                {showWeights && <div className="md:col-span-2">Weight (%)</div>}
                <div className={showWeights ? "md:col-span-5" : "md:col-span-7"}>Comments</div>
              </div>
              
              {previousFactors.map((factor) => (
                <div key={factor.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 rounded-md bg-slate-50">
                  <div className="md:col-span-3 font-medium">{factor.name}</div>
                  <div className="md:col-span-2">
                    <div className={`text-sm font-medium ${getRatingColor(factor.value)}`}>
                      {factor.value === "1" ? "Very Low (1)" : 
                       factor.value === "2" ? "Low (2)" : 
                       factor.value === "3" ? "Medium (3)" : 
                       factor.value === "4" ? "High (4)" : 
                       factor.value === "5" ? "Very High (5)" : ""}
                    </div>
                  </div>
                  {showWeights && <div className="md:col-span-2">{factor.weighting}%</div>}
                  <div className={showWeights ? "md:col-span-5" : "md:col-span-7"}>
                    <div className="text-sm text-slate-600">{factor.comments}</div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-slate-50 rounded-md border gap-4">
        <div>
          <h3 className="font-medium text-slate-700">Overall Residual Risk Rating</h3>
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
      
      {/* Risk Appetite Alert */}
      {parseFloat(overallScore) > parseFloat(formState.riskAppetite.threshold) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Outside Risk Appetite</h3>
            <p className="text-sm text-red-700 mt-1">
              The current residual risk rating ({overallScore}) exceeds the defined risk appetite threshold ({formState.riskAppetite.threshold}).
              This requires a remediation plan to bring the risk within appetite.
            </p>
            <Button 
              variant="destructive" 
              size="sm" 
              className="mt-3" 
              onClick={createAppetiteBreachIssue}
            >
              Create Remediation Issue
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.id} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 border rounded-md bg-white">
            <div className="md:col-span-2">
              <Label htmlFor={`res-factor-name-${factor.id}`}>Factor Name</Label>
              <Input
                id={`res-factor-name-${factor.id}`}
                value={factor.name}
                onChange={(e) => handleFactorChange(factor.id, "name", e.target.value)}
                className="mt-1"
                placeholder="Enter factor name"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor={`res-factor-value-${factor.id}`}>Rating</Label>
              <Select
                value={factor.value}
                onValueChange={(value) => handleFactorChange(factor.id, "value", value)}
              >
                <SelectTrigger id={`res-factor-value-${factor.id}`} className={`mt-1 ${getCellColor(factor.value)}`}>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-green-500">Very Low (1)</SelectItem>
                  <SelectItem value="2" className="text-yellow-500">Low (2)</SelectItem>
                  <SelectItem value="3" className="text-orange-500">Medium (3)</SelectItem>
                  <SelectItem value="4" className="text-red-500">High (4)</SelectItem>
                  <SelectItem value="5" className="text-red-600 font-semibold">Very High (5)</SelectItem>
                </SelectContent>
              </Select>
              {factor.value && (
                <div className={`text-xs font-medium mt-1 ${getRatingColor(factor.value)}`}>
                  {factor.value === "1" ? "Very Low" : 
                   factor.value === "2" ? "Low" : 
                   factor.value === "3" ? "Medium" : 
                   factor.value === "4" ? "High" : 
                   factor.value === "5" ? "Very High" : ""}
                </div>
              )}
            </div>
            
            {localShowWeights && (
              <div className="md:col-span-1">
                <Label htmlFor={`res-factor-weight-${factor.id}`}>Weight (%)</Label>
                <Input
                  id={`res-factor-weight-${factor.id}`}
                  type="number"
                  min="0"
                  max="100"
                  value={factor.weighting}
                  onChange={(e) => handleFactorChange(factor.id, "weighting", e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            
            <div className={`${localShowWeights ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <Label htmlFor={`res-factor-comments-${factor.id}`}>Comments</Label>
              <Textarea
                id={`res-factor-comments-${factor.id}`}
                value={factor.comments}
                onChange={(e) => handleFactorChange(factor.id, "comments", e.target.value)}
                className="mt-1 min-h-[60px]"
                placeholder="Add comments"
              />
            </div>
            
            <div className="md:col-span-1 flex items-end justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveFactor(factor.id)}
                disabled={factors.length <= 1}
                className="text-red-500 h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddFactor}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Factor
        </Button>
        
        <Button onClick={onNext}>Continue to Treatment</Button>
      </div>
    </div>
  );
};

export default ResidualRatingSection;
