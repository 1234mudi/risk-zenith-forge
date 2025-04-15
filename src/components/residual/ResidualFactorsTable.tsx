
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FactorProps } from "@/types/control-types";
import { PlusCircle, Trash2 } from "lucide-react";

interface ResidualFactorsTableProps {
  factors: FactorProps[];
  localShowWeights: boolean;
  handleAddFactor: (parentId: string) => void;
  handleRemoveFactor: (parentId: string, childId?: string) => void;
  handleFactorChange: (parentId: string, field: keyof FactorProps, value: any, childId?: string) => void;
  getCellColor: (value: string) => string;
}

const ResidualFactorsTable = ({
  factors,
  localShowWeights,
  handleAddFactor,
  handleRemoveFactor,
  handleFactorChange,
  getCellColor
}: ResidualFactorsTableProps) => {
  return (
    <div className="border rounded-md overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Factor</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Rating</TableHead>
            {localShowWeights && <TableHead>Weight (%)</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {factors.map((parentFactor) => (
            <React.Fragment key={parentFactor.id}>
              <TableRow className="bg-blue-50">
                <TableCell colSpan={localShowWeights ? 5 : 4} className="font-medium py-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Input 
                        value={parentFactor.name}
                        onChange={(e) => handleFactorChange(parentFactor.id, "name", e.target.value)}
                        className="font-medium border-blue-200"
                        placeholder="Parent Factor Name"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddFactor(parentFactor.id)}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" /> Add Child Factor
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {parentFactor.children?.map((factor) => (
                <TableRow key={factor.id}>
                  <TableCell>
                    <Input 
                      value={factor.name}
                      onChange={(e) => handleFactorChange(parentFactor.id, "name", e.target.value, factor.id)}
                      placeholder="Factor name"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={factor.description}
                      onChange={(e) => handleFactorChange(parentFactor.id, "description", e.target.value, factor.id)}
                      placeholder="Description"
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={factor.value}
                      onValueChange={(value) => handleFactorChange(parentFactor.id, "value", value, factor.id)}
                    >
                      <SelectTrigger className={`w-full ${getCellColor(factor.value || "0")}`}>
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
                  {localShowWeights && (
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={factor.weighting}
                        onChange={(e) => handleFactorChange(parentFactor.id, "weighting", e.target.value, factor.id)}
                        className="w-full"
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex space-x-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            Comments
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Comments for {factor.name}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <Textarea
                              value={factor.comments}
                              onChange={(e) => handleFactorChange(parentFactor.id, "comments", e.target.value, factor.id)}
                              className="min-h-[100px]"
                              placeholder="Add your comments here..."
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFactor(parentFactor.id, factor.id)}
                        className="text-red-500 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResidualFactorsTable;
