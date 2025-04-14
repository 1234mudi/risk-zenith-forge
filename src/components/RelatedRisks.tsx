
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const RelatedRisks = () => {
  // This would typically come from an API or context
  const mockRelatedRisks = [
    { id: "ERA-7751", name: "Credit risk assessment", inherentScore: "4.2", controlScore: "3.1", residualScore: "2.5" },
    { id: "ERA-7753", name: "Market risk assessment", inherentScore: "3.8", controlScore: "3.6", residualScore: "1.9" },
    { id: "ERA-7754", name: "Compliance risk assessment", inherentScore: "2.3", controlScore: "4.0", residualScore: "1.2" },
  ];
  
  const getAggregateScore = (scoreType: string) => {
    const total = mockRelatedRisks.reduce((sum, risk) => sum + parseFloat(risk[scoreType]), 0);
    return (total / mockRelatedRisks.length).toFixed(1);
  };
  
  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 4) return "text-red-600 bg-red-50";
    if (numScore >= 3) return "text-orange-600 bg-orange-50";
    if (numScore >= 2) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <span>Related Risks</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Related Risk Assessments</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">Aggregated Risk Scores</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-slate-500">Inherent Risk</div>
                <div className={`mt-1 text-sm font-semibold px-2 py-1 rounded inline-block ${getScoreColor(getAggregateScore("inherentScore"))}`}>
                  {getAggregateScore("inherentScore")}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Control Effectiveness</div>
                <div className={`mt-1 text-sm font-semibold px-2 py-1 rounded inline-block ${getScoreColor(getAggregateScore("controlScore"))}`}>
                  {getAggregateScore("controlScore")}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Residual Risk</div>
                <div className={`mt-1 text-sm font-semibold px-2 py-1 rounded inline-block ${getScoreColor(getAggregateScore("residualScore"))}`}>
                  {getAggregateScore("residualScore")}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">ID</th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">Risk Assessment</th>
                  <th className="px-4 py-2 text-center font-medium text-slate-600">Inherent</th>
                  <th className="px-4 py-2 text-center font-medium text-slate-600">Control</th>
                  <th className="px-4 py-2 text-center font-medium text-slate-600">Residual</th>
                  <th className="px-4 py-2 text-center font-medium text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockRelatedRisks.map((risk) => (
                  <tr key={risk.id}>
                    <td className="px-4 py-3 font-mono text-xs">{risk.id}</td>
                    <td className="px-4 py-3">{risk.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(risk.inherentScore)}`}>
                        {risk.inherentScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(risk.controlScore)}`}>
                        {risk.controlScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(risk.residualScore)}`}>
                        {risk.residualScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelatedRisks;
