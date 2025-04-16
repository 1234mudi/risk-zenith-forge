
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy, ChevronDown, ChevronUp, Info } from "lucide-react";
import { FactorProps, Control } from "@/types/control-types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PreviousAssessmentDetails = {
  date: string;
  score: string;
};

type PreviousAssessmentsSectionProps = {
  title: string;
  assessmentHistory: PreviousAssessmentDetails[];
  factors?: FactorProps[];
  controls?: Control[];
  showWeights: boolean;
  onCopyLatest: () => void;
  getScoreColor: (score: string) => string;
  getScoreLabel: (score: string) => string;
  getRatingColor: (value: string) => string;
  type: 'inherent' | 'control' | 'residual';
};

const PreviousAssessmentsSection = ({
  title,
  assessmentHistory,
  factors,
  controls,
  showWeights,
  onCopyLatest,
  getScoreColor,
  getScoreLabel,
  getRatingColor,
  type
}: PreviousAssessmentsSectionProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);

  if (!assessmentHistory || assessmentHistory.length === 0) {
    return null;
  }

  const selectedAssessment = assessmentHistory[selectedAssessmentIndex];
  
  const getNoteText = () => {
    if (type === 'inherent' || type === 'residual') {
      return "Last 5 assessment results of the risk. Click on each time period to get details.";
    } else if (type === 'control') {
      return "Last 5 control test results of the controls related to this risk. Click on each time period to get details.";
    }
    return "";
  };

  return (
    <Collapsible
      defaultOpen={false}
      className="border rounded-md overflow-hidden mb-6"
    >
      <div className="bg-slate-50 p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 sm:mb-0">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <h3 className="font-medium text-slate-700">{title}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="h-4 w-4 text-slate-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">{getNoteText()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2 my-2 sm:my-0">
            {assessmentHistory.map((assessment, index) => (
              <Badge 
                key={index}
                variant={selectedAssessmentIndex === index ? "default" : "outline"} 
                className={`cursor-pointer ${selectedAssessmentIndex === index ? "" : "text-xs"}`}
                onClick={() => setSelectedAssessmentIndex(index)}
              >
                {assessment.date}
              </Badge>
            ))}
          </div>
          <Badge className={getScoreColor(selectedAssessment.score)}>
            Score: {selectedAssessment.score} ({getScoreLabel(selectedAssessment.score)})
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCopyLatest}
            className="flex items-center gap-1"
          >
            <Copy size={14} />
            <span>Copy results to current assessment</span>
          </Button>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1"
            >
              {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showHistory ? "Hide" : "Show"}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="p-4 space-y-4 bg-white">
          {type === 'control' && controls && (
            <Table className="border-collapse border border-slate-200">
              <TableHeader className="bg-yellow-50">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="border border-slate-200">Control ID</TableHead>
                  <TableHead className="border border-slate-200">Control Name</TableHead>
                  <TableHead className="border border-slate-200">Category</TableHead>
                  <TableHead className="border border-slate-200">Design</TableHead>
                  <TableHead className="border border-slate-200">Operating</TableHead>
                  <TableHead className="border border-slate-200">Overall</TableHead>
                  {showWeights && <TableHead className="border border-slate-200">Factor Weightage (%)</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.map((control) => (
                  <TableRow key={control.id} className="border-b border-slate-200">
                    <TableCell className="font-mono border border-slate-200">{control.controlId}</TableCell>
                    <TableCell className="border border-slate-200">{control.name}</TableCell>
                    <TableCell className="border border-slate-200">{control.category}</TableCell>
                    <TableCell className="border border-slate-200">{control.designEffect}</TableCell>
                    <TableCell className="border border-slate-200">{control.operativeEffect}</TableCell>
                    <TableCell className="border border-slate-200">
                      <span className={getRatingColor(control.effectiveness || "0")}>
                        {control.effectiveness}
                      </span>
                    </TableCell>
                    {showWeights && <TableCell className="border border-slate-200">{control.weighting}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {(type === 'inherent' || type === 'residual') && factors && (
            <Table className="border-collapse border border-slate-200">
              <TableHeader className="bg-yellow-50">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="border border-slate-200">Factor</TableHead>
                  <TableHead className="border border-slate-200">Description</TableHead>
                  <TableHead className="border border-slate-200">Rating</TableHead>
                  {showWeights && <TableHead className="border border-slate-200">Factor Weightage (%)</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {factors.map((factor) => (
                  <TableRow key={factor.id} className="border-b border-slate-200">
                    <TableCell className="font-medium border border-slate-200">{factor.name}</TableCell>
                    <TableCell className="border border-slate-200">{factor.description}</TableCell>
                    <TableCell className="border border-slate-200">
                      <span className={getRatingColor(factor.value || "0")}>
                        {factor.value === "1" ? "Very Low (1)" : 
                         factor.value === "2" ? "Low (2)" : 
                         factor.value === "3" ? "Medium (3)" : 
                         factor.value === "4" ? "High (4)" : 
                         factor.value === "5" ? "Very High (5)" : "Not Rated"}
                      </span>
                    </TableCell>
                    {showWeights && <TableCell className="border border-slate-200">{factor.weighting}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PreviousAssessmentsSection;
