
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "@/contexts/FormContext";

type InherentFactor = {
  id: string;
  name: string;
  value: string;
  weighting: string;
  comments: string;
};

const DEFAULT_FACTORS: InherentFactor[] = [
  { id: "1", name: "Financial Impact", value: "", weighting: "25", comments: "" },
  { id: "2", name: "Reputational Impact", value: "", weighting: "25", comments: "" },
  { id: "3", name: "Operational Impact", value: "", weighting: "25", comments: "" },
  { id: "4", name: "Regulatory Impact", value: "", weighting: "25", comments: "" },
];

const InherentRatingSection = ({ onNext }: { onNext: () => void }) => {
  const [factors, setFactors] = useState<InherentFactor[]>(DEFAULT_FACTORS);
  const { updateForm } = useForm();

  const handleAddFactor = () => {
    const newId = (factors.length + 1).toString();
    setFactors([
      ...factors,
      { id: newId, name: "", value: "", weighting: "0", comments: "" }
    ]);
  };

  const handleRemoveFactor = (id: string) => {
    if (factors.length <= 1) return;
    setFactors(factors.filter(factor => factor.id !== id));
  };

  const handleFactorChange = (id: string, field: keyof InherentFactor, value: string) => {
    const updatedFactors = factors.map(factor => 
      factor.id === id ? { ...factor, [field]: value } : factor
    );
    setFactors(updatedFactors);
    updateForm({ inherentFactors: updatedFactors });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h2 className="text-xl font-medium text-blue-800 mb-2">Inherent Risk Rating</h2>
        <p className="text-blue-700 text-sm">Assess the initial impact of the risk before any controls are applied.</p>
      </div>
      
      <div className="space-y-4">
        {factors.map((factor) => (
          <div key={factor.id} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 border rounded-md bg-white">
            <div className="md:col-span-2">
              <Label htmlFor={`factor-name-${factor.id}`}>Factor Name</Label>
              <Input
                id={`factor-name-${factor.id}`}
                value={factor.name}
                onChange={(e) => handleFactorChange(factor.id, "name", e.target.value)}
                className="mt-1"
                placeholder="Enter factor name"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor={`factor-value-${factor.id}`}>Rating</Label>
              <Select
                value={factor.value}
                onValueChange={(value) => handleFactorChange(factor.id, "value", value)}
              >
                <SelectTrigger id={`factor-value-${factor.id}`} className="mt-1">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Very Low (1)</SelectItem>
                  <SelectItem value="2">Low (2)</SelectItem>
                  <SelectItem value="3">Medium (3)</SelectItem>
                  <SelectItem value="4">High (4)</SelectItem>
                  <SelectItem value="5">Very High (5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-1">
              <Label htmlFor={`factor-weight-${factor.id}`}>Weight (%)</Label>
              <Input
                id={`factor-weight-${factor.id}`}
                type="number"
                min="0"
                max="100"
                value={factor.weighting}
                onChange={(e) => handleFactorChange(factor.id, "weighting", e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor={`factor-comments-${factor.id}`}>Comments</Label>
              <Textarea
                id={`factor-comments-${factor.id}`}
                value={factor.comments}
                onChange={(e) => handleFactorChange(factor.id, "comments", e.target.value)}
                className="mt-1 min-h-[60px]"
                placeholder="Add comments"
              />
            </div>
            
            <div className="md:col-span-1 flex items-end justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveFactor(factor.id)}
                disabled={factors.length <= 1}
                className="text-red-500 h-9 w-9"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddFactor}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Factor
        </Button>
        
        <Button onClick={onNext}>Continue to Control Effectiveness</Button>
      </div>
    </div>
  );
};

export default InherentRatingSection;
