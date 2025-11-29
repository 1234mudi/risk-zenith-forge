import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy, ChevronDown, Info } from "lucide-react";
import { FactorProps, Control } from "@/types/control-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

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
    <div className="mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <Clock size={14} />
            <span className="text-sm">{title}</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {assessmentHistory.length}
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="start">
          <div className="p-4 border-b bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
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
            
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {assessmentHistory.map((assessment, index) => (
                <Badge 
                  key={index}
                  variant={selectedAssessmentIndex === index ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedAssessmentIndex(index)}
                >
                  {assessment.date}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={getScoreColor(selectedAssessment.score)}>
                Score: {selectedAssessment.score} ({getScoreLabel(selectedAssessment.score)})
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCopyLatest}
                className="flex items-center gap-1"
              >
                <Copy size={14} />
                <span>Copy to current</span>
              </Button>
            </div>
          </div>
          
          {showDetails && (
            <div className="p-4 space-y-4 bg-white max-h-[400px] overflow-y-auto">
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
          )}
          
          <div className="p-3 border-t bg-slate-50">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-1"
            >
              <ChevronDown size={14} className={showDetails ? "rotate-180 transition-transform" : "transition-transform"} />
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PreviousAssessmentsSection;
