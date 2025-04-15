
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy, ChevronDown, ChevronUp } from "lucide-react";
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

  return (
    <Collapsible
      defaultOpen={false}
      className="border rounded-md overflow-hidden mb-6"
    >
      <div className="bg-slate-50 p-3 flex justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-slate-500" />
          <h3 className="font-medium text-slate-700">{title}</h3>
          <div className="flex items-center gap-2">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Control ID</TableHead>
                  <TableHead>Control Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Operating</TableHead>
                  <TableHead>Overall</TableHead>
                  {showWeights && <TableHead>Weight (%)</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {controls.map((control) => (
                  <TableRow key={control.id}>
                    <TableCell className="font-mono">{control.controlId}</TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell>{control.category}</TableCell>
                    <TableCell>{control.designEffect}</TableCell>
                    <TableCell>{control.operativeEffect}</TableCell>
                    <TableCell>
                      <span className={getRatingColor(control.effectiveness || "0")}>
                        {control.effectiveness}
                      </span>
                    </TableCell>
                    {showWeights && <TableCell>{control.weighting}%</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {(type === 'inherent' || type === 'residual') && factors && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Rating</TableHead>
                  {showWeights && <TableHead>Weight (%)</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {factors.map((factor) => (
                  <TableRow key={factor.id}>
                    <TableCell className="font-medium">{factor.name}</TableCell>
                    <TableCell>{factor.description}</TableCell>
                    <TableCell>
                      <span className={getRatingColor(factor.value || "0")}>
                        {factor.value === "1" ? "Very Low (1)" : 
                         factor.value === "2" ? "Low (2)" : 
                         factor.value === "3" ? "Medium (3)" : 
                         factor.value === "4" ? "High (4)" : 
                         factor.value === "5" ? "Very High (5)" : "Not Rated"}
                      </span>
                    </TableCell>
                    {showWeights && <TableCell>{factor.weighting}%</TableCell>}
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
