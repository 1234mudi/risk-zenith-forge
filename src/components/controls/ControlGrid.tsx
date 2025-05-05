
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar } from "lucide-react";
import { Control } from "@/types/control-types";
import { getEffectivenessColor, getRatingColor, getTestResultColor } from "@/utils/control-utils";
import ControlDetailsDialog from "./ControlDetailsDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

type ControlGridProps = {
  controls: Control[];
  onUpdateControl: (id: string, field: keyof Control, value: any) => void;
  onRemoveControl: (id: string) => void;
  showWeights: boolean;
};

const ControlGrid = ({ 
  controls, 
  onUpdateControl, 
  onRemoveControl, 
  showWeights 
}: ControlGridProps) => {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Control ID</TableHead>
            <TableHead>Control Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Design</TableHead>
            <TableHead>Operating</TableHead>
            <TableHead>Overall</TableHead>
            <TableHead>Control Test Results</TableHead>
            <TableHead>Control Tester</TableHead>
            <TableHead>Last Tested On</TableHead>
            {showWeights && <TableHead>Weight (%)</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controls.map((control) => (
            <React.Fragment key={control.id}>
              <TableRow>
                <TableCell>
                  <Input 
                    value={control.controlId}
                    onChange={(e) => onUpdateControl(control.id, "controlId", e.target.value)}
                    className="font-mono text-xs"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={control.name}
                    onChange={(e) => onUpdateControl(control.id, "name", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={control.category}
                    onValueChange={(value) => onUpdateControl(control.id, "category", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Preventive</SelectItem>
                      <SelectItem value="detective">Detective</SelectItem>
                      <SelectItem value="corrective">Corrective</SelectItem>
                      <SelectItem value="directive">Directive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={control.designEffect}
                    onValueChange={(value) => onUpdateControl(control.id, "designEffect", value)}
                  >
                    <SelectTrigger className={`w-full ${getEffectivenessColor(control.designEffect)}`}>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ineffective" className="text-red-500">Ineffective</SelectItem>
                      <SelectItem value="partially" className="text-orange-500">Partially Effective</SelectItem>
                      <SelectItem value="effective" className="text-green-500">Effective</SelectItem>
                      <SelectItem value="highly" className="text-green-600 font-semibold">Highly Effective</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={control.operativeEffect}
                    onValueChange={(value) => onUpdateControl(control.id, "operativeEffect", value)}
                  >
                    <SelectTrigger className={`w-full ${getEffectivenessColor(control.operativeEffect)}`}>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ineffective" className="text-red-500">Ineffective</SelectItem>
                      <SelectItem value="partially" className="text-orange-500">Partially Effective</SelectItem>
                      <SelectItem value="effective" className="text-green-500">Effective</SelectItem>
                      <SelectItem value="highly" className="text-green-600 font-semibold">Highly Effective</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={control.effectiveness}
                    onValueChange={(value) => onUpdateControl(control.id, "effectiveness", value)}
                  >
                    <SelectTrigger className={`w-full ${getRatingColor(control.effectiveness)}`}>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="text-green-500">Very Low (1)</SelectItem>
                      <SelectItem value="2" className="text-yellow-500">Low (2)</SelectItem>
                      <SelectItem value="3" className="text-orange-500">Medium (3)</SelectItem>
                      <SelectItem value="4" className="text-red-500">High (4)</SelectItem>
                      <SelectItem value="5" className="text-red-600 font-semibold">Very High (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={control.testResults?.result || ""}
                    onValueChange={(value) => {
                      const testResults = control.testResults || { lastTested: "", result: "", tester: "", findings: "" };
                      onUpdateControl(control.id, "testResults", { ...testResults, result: value });
                    }}
                  >
                    <SelectTrigger className={`w-full ${getEffectivenessColor(control.testResults?.result || "")}`}>
                      <SelectValue placeholder="Test Result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="effective" className="text-green-500">Effective</SelectItem>
                      <SelectItem value="partially" className="text-orange-500">Partially Effective</SelectItem>
                      <SelectItem value="ineffective" className="text-red-500">Ineffective</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input 
                    value={control.testResults?.tester || ""}
                    onChange={(e) => {
                      const testResults = control.testResults || { lastTested: "", result: "", tester: "", findings: "" };
                      onUpdateControl(control.id, "testResults", { ...testResults, tester: e.target.value });
                    }}
                    placeholder="Tester name"
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`w-full justify-start text-left font-normal ${!control.testResults?.lastTested && "text-muted-foreground"}`}
                      >
                        {control.testResults?.lastTested ? format(new Date(control.testResults.lastTested), "PPP") : <span>Select date</span>}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        className="p-3 pointer-events-auto"
                        selected={control.testResults?.lastTested ? new Date(control.testResults.lastTested) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            const testResults = control.testResults || { lastTested: "", result: "", tester: "", findings: "" };
                            onUpdateControl(control.id, "testResults", { ...testResults, lastTested: formattedDate });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                {showWeights && (
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={control.weighting}
                      onChange={(e) => onUpdateControl(control.id, "weighting", e.target.value)}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex space-x-1">
                    <ControlDetailsDialog 
                      control={control}
                      onUpdateControl={onUpdateControl}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveControl(control.id)}
                      disabled={controls.length <= 1}
                      className="text-red-500 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {control.testResults && (
                <TableRow>
                  <TableCell colSpan={showWeights ? 11 : 10} className="bg-slate-50 py-2 px-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Test Findings:</span> 
                        <span>{control.testResults.findings || "No findings recorded"}</span>
                      </div>
                      <Badge className={getTestResultColor(control.testResults.result)}>
                        {control.testResults.result === "effective" ? "Effective" : 
                         control.testResults.result === "partially" ? "Partially Effective" : "Ineffective"}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ControlGrid;
