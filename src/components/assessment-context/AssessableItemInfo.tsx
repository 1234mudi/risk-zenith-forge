
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

interface AssessableItemInfoProps {
  assessableItem: string;
  onAssessableItemChange: (value: string) => void;
}

const AssessableItemInfo = ({ assessableItem, onAssessableItemChange }: AssessableItemInfoProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="assessableItem" className="text-slate-700 font-semibold">Assessable Item</Label>
      <div className="relative">
        <Input
          id="assessableItem"
          value={assessableItem}
          onChange={(e) => onAssessableItemChange(e.target.value)}
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
                <DialogTitle>Assessable Item Details</DialogTitle>
                <DialogDescription>
                  Additional information about this assessable item.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold text-sm">ID</h4>
                  <p className="text-sm text-slate-600">ITEM-4567</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Description</h4>
                  <p className="text-sm text-slate-600">
                    Process to verify and validate customer identity and assess associated risks.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Owner</h4>
                  <p className="text-sm text-slate-600">Compliance Department</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Regulatory References</h4>
                  <p className="text-sm text-slate-600">FATF Recommendations, AML Directive</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AssessableItemInfo;
