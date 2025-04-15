
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

interface RiskInfoProps {
  risk: string;
  riskHierarchy: string;
  riskIdDisplay: string;
  onRiskChange: (value: string) => void;
  onRiskHierarchyChange: (value: string) => void; // Added the missing prop
}

const RiskInfo = ({ risk, riskHierarchy, riskIdDisplay, onRiskChange, onRiskHierarchyChange }: RiskInfoProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="risk" className="text-slate-700 font-semibold">Risk</Label>
      <div className="relative">
        <Input
          id="risk"
          value={risk}
          onChange={(e) => onRiskChange(e.target.value)}
          className="text-center font-medium bg-white"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <InfoIcon className="h-4 w-4 text-slate-400" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Risk Details</DialogTitle>
                <DialogDescription>
                  Additional information about this risk.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-sm">ID</h4>
                  <p className="text-sm text-slate-600">{riskIdDisplay}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Description</h4>
                  <p className="text-sm text-slate-600">
                    Risk of incomplete or inadequate assessment of key individuals or entities involved in a potential Direct Transaction.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Risk Category</h4>
                  <p className="text-sm text-slate-600">Compliance Risk</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Risk Hierarchy</h4>
                  <p className="text-sm text-slate-600">{riskHierarchy}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          <Badge variant="outline" className="bg-slate-100 text-slate-600 font-normal">
            {riskHierarchy}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default RiskInfo;
