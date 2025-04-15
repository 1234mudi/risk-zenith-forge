import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Clock, Plus, LineChart as LineChartIcon, PenLine } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import HistoricalAssessmentsDialog from "./HistoricalAssessmentsDialog";
import EditableGrid, { EditableGridColumn } from "@/components/ui/editable-grid";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [manualOverride, setManualOverride] = useState<boolean>(false);
  const [overrideScore, setOverrideScore] = useState<string>("");
  const [overrideComment, setOverrideComment] = useState<string>("");
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showPreviousAssessment, setShowPreviousAssessment] = useState(false);
  const [showTrendChart, setShowTrendChart] = useState(false);

  const handleFactorsChange = (updatedFactors: InherentFactor[]) => {
    setFactors(updatedFactors);
    updateForm({ inherentFactors: updatedFactors });
    if (!manualOverride) {
      calculateScore(updatedFactors);
    }
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
    if (numScore >= 4) return "bg-red-600 text-white border-red-700";
    if (numScore >= 3) return "bg-orange-500 text-white border-orange-600";
    if (numScore >= 2) return "bg-yellow-500 text-white border-yellow-600";
    return "bg-green-500 text-white border-green-600";
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

  const handleOverrideToggle = (checked: boolean) => {
    setManualOverride(checked);
    if (!checked) {
      calculateScore(factors);
      setOverrideScore("");
      setOverrideComment("");
      updateForm({ inherentRatingOverrideComment: "" });
    } else {
      setOverrideScore(overallScore);
    }
  };

  const handleOverrideScoreChange = (value: string) => {
    if (isNaN(Number(value)) && value !== "") return;
    
    let newValue = value;
    if (value !== "" && Number(value) > 5) newValue = "5";
    if (value !== "" && Number(value) < 0) newValue = "0";
    
    setOverrideScore(newValue);
    if (newValue !== "") {
      const formattedScore = Number(newValue).toFixed(1);
      setOverallScore(formattedScore);
      updateForm({ 
        inherentRatingScore: formattedScore,
        inherentRatingOverrideComment: overrideComment,
        inherentRatingOverridden: true
      });
    }
  };

  const handleOverrideCommentChange = (value: string) => {
    setOverrideComment(value);
    updateForm({ inherentRatingOverrideComment: value });
  };

  const getTrendChartData = () => {
    const historicalData = [...formState.historicalAssessments];
    
    historicalData.sort((a, b) => 
      new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime()
    );
    
    return historicalData.map(assessment => ({
      date: new Date(assessment.assessmentDate).toLocaleDateString('en-US', { 
        year: '2-digit', 
        month: 'short'
      }),
      score: parseFloat(assessment.inherentRatingScore || "0")
    }));
  };

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
      
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTrendChart(!showTrendChart)}
          className="flex items-center gap-1 mb-2"
        >
          <LineChartIcon className="h-4 w-4" />
          {showTrendChart ? "Hide Trend Chart" : "Show Trend Chart"}
        </Button>
      </div>
      
      {showTrendChart && (
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Inherent Risk Rating Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTrendChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <RechartsTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Inherent Risk" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
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
                <span>Copy results to current assessment</span>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factor Name</TableHead>
                    <TableHead>Rating</TableHead>
                    {localShowWeights && <TableHead>Weight (%)</TableHead>}
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousFactors.map((factor) => (
                    <TableRow key={factor.id}>
                      <TableCell className="font-medium">{factor.name}</TableCell>
                      <TableCell className={getCellColor(factor.value)}>
                        {factor.value} - {getScoreLabel(factor.value)}
                      </TableCell>
                      {localShowWeights && <TableCell>{factor.weighting}%</TableCell>}
                      <TableCell className="max-w-md truncate">{factor.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-slate-50 rounded-md border gap-4">
        <div>
          <h3 className="font-medium text-slate-700">Overall Inherent Risk Rating</h3>
          <p className="text-sm text-slate-500">Calculated based on weighted factors</p>
          
          {manualOverride && (
            <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700 border-yellow-300">
              <PenLine className="h-3 w-3 mr-1" /> 
              Manually Adjusted
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleWeights}
            className="flex items-center gap-1"
          >
            {localShowWeights ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {localShowWeights ? "Hide Weights" : "Show Weights"}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <PenLine className="h-4 w-4" />
                {manualOverride ? "Edit Override" : "Override Rating"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Override Inherent Risk Rating</DialogTitle>
                <DialogDescription>
                  Manually adjust the rating if the calculated value doesn't reflect your assessment.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center space-x-2 py-4">
                <Switch 
                  id="override" 
                  checked={manualOverride}
                  onCheckedChange={handleOverrideToggle}
                />
                <Label htmlFor="override">Enable manual override</Label>
              </div>
              
              {manualOverride && (
                <>
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="override-score" className="text-right">
                        Rating
                      </Label>
                      <Input
                        id="override-score"
                        value={overrideScore}
                        onChange={(e) => handleOverrideScoreChange(e.target.value)}
                        className="col-span-3"
                        placeholder="Enter value (0-5)"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="override-comment" className="text-right">
                        Justification
                      </Label>
                      <Textarea
                        id="override-comment"
                        value={overrideComment}
                        onChange={(e) => handleOverrideCommentChange(e.target.value)}
                        placeholder="Explain why you're overriding the calculated rating"
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="submit">Save changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className={`px-4 py-2 rounded border ${getScoreColor(overallScore)}`}>
            <div className="text-sm font-medium">Score: {overallScore}</div>
            <div className="text-xs font-semibold">{getScoreLabel(overallScore)}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Factor Name</TableHead>
                <TableHead>Rating</TableHead>
                {localShowWeights && <TableHead>Weight (%)</TableHead>}
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factors.map((factor, index) => (
                <TableRow key={factor.id}>
                  <TableCell>
                    <Input 
                      value={factor.name}
                      onChange={(e) => {
                        const updatedFactors = [...factors];
                        updatedFactors[index].name = e.target.value;
                        handleFactorsChange(updatedFactors);
                      }}
                    />
                  </TableCell>
                  <TableCell className={getCellColor(factor.value)}>
                    <select 
                      value={factor.value}
                      onChange={(e) => {
                        const updatedFactors = [...factors];
                        updatedFactors[index].value = e.target.value;
                        handleFactorsChange(updatedFactors);
                      }}
                      className="w-full p-2 rounded border bg-transparent"
                    >
                      <option value="1">Very Low (1)</option>
                      <option value="2">Low (2)</option>
                      <option value="3">Medium (3)</option>
                      <option value="4">High (4)</option>
                      <option value="5">Very High (5)</option>
                    </select>
                  </TableCell>
                  {localShowWeights && (
                    <TableCell>
                      <Input 
                        type="number"
                        value={factor.weighting}
                        onChange={(e) => {
                          const updatedFactors = [...factors];
                          updatedFactors[index].weighting = e.target.value;
                          handleFactorsChange(updatedFactors);
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Textarea 
                      value={factor.comments}
                      onChange={(e) => {
                        const updatedFactors = [...factors];
                        updatedFactors[index].comments = e.target.value;
                        handleFactorsChange(updatedFactors);
                      }}
                      className="min-h-[60px]"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={onNext}>Continue to Control Effectiveness</Button>
        </div>
      </div>
    </div>
  );
};

export default InherentRatingSection;
