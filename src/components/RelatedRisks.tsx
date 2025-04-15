
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layers, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const relatedRisks = [
  {
    id: "RISK-2025-044",
    name: "Transaction Monitoring System Failures",
    inherentScore: "4.2",
    controlScore: "3.1",
    residualScore: "2.7",
  },
  {
    id: "RISK-2025-045",
    name: "AML Policy Compliance Gaps",
    inherentScore: "3.8",
    controlScore: "2.5",
    residualScore: "2.3",
  },
  {
    id: "RISK-2025-046",
    name: "Customer Screening Deficiencies",
    inherentScore: "3.5",
    controlScore: "1.8",
    residualScore: "1.9",
  }
];

const RelatedRisks = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 4) return "bg-red-600 text-white";
    if (numScore >= 3) return "bg-orange-500 text-white";
    if (numScore >= 2) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
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
          <span className="font-medium text-sm">Related Risks</span>
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
              <TableRow key={risk.id}>
                <TableCell className="py-2">
                  <div className="text-sm font-medium">{risk.name}</div>
                  <div className="text-xs text-gray-500">{risk.id}</div>
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
            ))}
          </TableBody>
        </Table>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RelatedRisks;
