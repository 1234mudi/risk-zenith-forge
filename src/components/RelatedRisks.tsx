
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layers, ChevronRight, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRisks, setExpandedRisks] = useState<string[]>([]);
  
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
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md w-full md:max-w-md"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-slate-50 rounded-t-md">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-sm">Associated Risks</span>
          <Badge variant="outline" className="text-xs bg-blue-50">
            {relatedRisks.length}
          </Badge>
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="p-3 border-t">
        <div className="text-xs text-gray-500 mb-2">
          Other risks in the same domain that may be affected by similar controls
        </div>
        
        <Table className="border">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-1/2">Risk</TableHead>
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
                      <div className="text-xs font-medium mb-2 flex items-center">
                        <Shield className="h-3 w-3 mr-1 text-blue-600" />
                        Associated Controls
                      </div>
                      <div className="space-y-2">
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
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RelatedRisks;
