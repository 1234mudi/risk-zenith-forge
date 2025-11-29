
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layers, ChevronRight, Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const relatedRisks = [
  {
    id: "RISK-2025-044",
    name: "Transaction Monitoring System Failures",
    inherentScore: "4.2",
    controlScore: "3.1",
    residualScore: "2.7",
    controls: [
      { id: "CTL-001", name: "System Monitoring", effectiveness: "3", category: "detective" },
      { id: "CTL-002", name: "Automated Alerts", effectiveness: "2", category: "preventive" },
    ]
  },
  {
    id: "RISK-2025-045",
    name: "AML Policy Compliance Gaps",
    inherentScore: "3.8",
    controlScore: "2.5",
    residualScore: "2.3",
    controls: [
      { id: "CTL-003", name: "Compliance Training", effectiveness: "2", category: "preventive" },
      { id: "CTL-004", name: "Policy Reviews", effectiveness: "3", category: "detective" },
    ]
  },
  {
    id: "RISK-2025-046",
    name: "Customer Screening Deficiencies",
    inherentScore: "3.5",
    controlScore: "1.8",
    residualScore: "1.9",
    controls: [
      { id: "CTL-005", name: "Screening Software", effectiveness: "2", category: "preventive" },
      { id: "CTL-006", name: "Manual Reviews", effectiveness: "1", category: "detective" },
    ]
  }
];

const RelatedRisks = () => {
  const [expandedRisks, setExpandedRisks] = useState<string[]>([]);
  const [expandedControls, setExpandedControls] = useState<{[key: string]: boolean}>({});
  
  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 4) return "bg-red-600 text-white";
    if (numScore >= 3) return "bg-orange-500 text-white";
    if (numScore >= 2) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  };

  const getEffectivenessColor = (value: string) => {
    const numValue = parseInt(value);
    if (numValue >= 4) return "bg-red-50 text-red-600";
    if (numValue >= 3) return "bg-orange-50 text-orange-600";
    if (numValue >= 2) return "bg-yellow-50 text-yellow-600";
    return "bg-green-50 text-green-600";
  };

  const getCategoryColor = (category: string) => {
    if (category === "preventive") return "bg-blue-50 text-blue-600";
    if (category === "detective") return "bg-purple-50 text-purple-600";
    if (category === "corrective") return "bg-green-50 text-green-600";
    return "bg-slate-50 text-slate-600";
  };

  const toggleRiskExpansion = (riskId: string) => {
    setExpandedRisks(prev => 
      prev.includes(riskId) 
        ? prev.filter(id => id !== riskId) 
        : [...prev, riskId]
    );
    
    // Initialize controls display for this risk if it's being expanded
    if (!expandedRisks.includes(riskId)) {
      setExpandedControls(prev => ({
        ...prev,
        [riskId]: false
      }));
    }
  };
  
  const toggleControlsDisplay = (riskId: string) => {
    setExpandedControls(prev => ({
      ...prev,
      [riskId]: !prev[riskId]
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        >
          <Layers className="h-4 w-4 text-blue-600" />
          <span className="text-sm">Associated Risks</span>
          <Badge variant="secondary" className="ml-1 text-xs">
            {relatedRisks.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[700px] p-0" align="start">
        <div className="p-3 border-b bg-slate-50">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Associated Risks</span>
          </div>
          <div className="text-xs text-slate-500">
            Other risks in the same domain that may be affected by similar controls
          </div>
        </div>
        
        <div className="max-h-[500px] overflow-y-auto">
          <Table className="border">
            <TableHeader className="bg-slate-50 sticky top-0">
              <TableRow>
                <TableHead>Risk</TableHead>
                <TableHead className="text-center">Inherent</TableHead>
                <TableHead className="text-center">Control</TableHead>
                <TableHead className="text-center">Residual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedRisks.map((risk) => (
                <React.Fragment key={risk.id}>
                  <TableRow 
                    className={expandedRisks.includes(risk.id) ? "border-b-0" : ""}
                    onClick={() => toggleRiskExpansion(risk.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="py-2">
                      <div className="flex items-center">
                        <ChevronRight 
                          className={`h-4 w-4 mr-1 transition-transform ${expandedRisks.includes(risk.id) ? 'rotate-90' : ''}`} 
                        />
                        <div>
                          <div className="text-sm font-medium">{risk.name}</div>
                          <div className="text-xs text-gray-500">{risk.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Badge className={`${getScoreColor(risk.inherentScore)}`}>
                        {risk.inherentScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Badge className={`${getScoreColor(risk.controlScore)}`}>
                        {risk.controlScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-2">
                      <Badge className={`${getScoreColor(risk.residualScore)}`}>
                        {risk.residualScore}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  
                  {expandedRisks.includes(risk.id) && (
                    <TableRow>
                      <TableCell colSpan={4} className="bg-slate-50 p-3">
                        <div 
                          className="text-xs font-medium mb-2 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleControlsDisplay(risk.id)}
                        >
                          <div className="flex items-center">
                            <Shield className="h-3 w-3 mr-1 text-blue-600" />
                            Associated Controls
                            <Badge variant="outline" className="ml-2 text-xs bg-blue-50">
                              {risk.controls.length}
                            </Badge>
                          </div>
                          <ChevronRight 
                            className={`h-3 w-3 transition-transform ${expandedControls[risk.id] ? 'rotate-90' : ''}`} 
                          />
                        </div>
                        
                        {expandedControls[risk.id] && (
                          <div className="space-y-2 mt-3">
                            {risk.controls.map(control => (
                              <div key={control.id} className="flex justify-between items-center p-2 bg-white rounded border text-xs">
                                <div>
                                  <span className="font-medium">{control.name}</span>
                                  <span className="text-gray-500 ml-2 font-mono">{control.id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getCategoryColor(control.category)} variant="outline">
                                    {control.category}
                                  </Badge>
                                  <Badge className={getEffectivenessColor(control.effectiveness)}>
                                    {control.effectiveness}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            This risk shares controls with the current risk assessment
                          </div>
                          <Badge variant="outline" className="text-xs">View Full Risk</Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RelatedRisks;
