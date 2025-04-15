
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";
import { Control } from "@/types/control-types";
import { getTestResultColor } from "@/utils/control-utils";

type ControlDetailsDialogProps = {
  control: Control;
  onUpdateControl: (id: string, field: keyof Control, value: any) => void;
};

const ControlDetailsDialog = ({ control, onUpdateControl }: ControlDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ExternalLink className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Control Details: {control.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor={`comments-${control.id}`}>Comments</Label>
            <Textarea
              id={`comments-${control.id}`}
              value={control.comments}
              onChange={(e) => onUpdateControl(control.id, "comments", e.target.value)}
              className="min-h-[80px] mt-1"
              placeholder="Add comments about this control"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`key-control-${control.id}`} 
              checked={control.isKeyControl}
              onCheckedChange={(checked) => 
                onUpdateControl(control.id, "isKeyControl", checked === true)
              }
            />
            <Label htmlFor={`key-control-${control.id}`}>Key Control</Label>
          </div>
          
          {control.testResults && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Latest Control Test Results</h3>
              <div className="bg-slate-50 p-3 rounded-md border space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">Test Date: {control.testResults.lastTested}</span>
                  </div>
                  <Badge className={getTestResultColor(control.testResults.result)}>
                    {control.testResults.result === "pass" ? "Passed" : 
                     control.testResults.result === "partial" ? "Partially Passed" : "Failed"}
                  </Badge>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium">Tester:</div>
                  <div>{control.testResults.tester}</div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium">Findings:</div>
                  <div className="p-2 bg-white border rounded mt-1">
                    {control.testResults.findings}
                  </div>
                </div>
                
                <div className="pt-2 border-t mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    View Test Evidence
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ControlDetailsDialog;
