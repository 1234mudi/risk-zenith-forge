
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "@/contexts/FormContext";

type Control = {
  id: string;
  controlId: string;
  name: string;
  designEffect: string;
  operativeEffect: string;
  effectiveness: string;
  weighting: string;
  isKeyControl: boolean;
  category: string;
  comments: string;
};

const DEFAULT_CONTROLS: Control[] = [
  {
    id: "1",
    controlId: "CTL-001",
    name: "Access Control Management",
    designEffect: "",
    operativeEffect: "",
    effectiveness: "",
    weighting: "25",
    isKeyControl: true,
    category: "preventive",
    comments: ""
  },
  {
    id: "2",
    controlId: "CTL-002",
    name: "Change Management Process",
    designEffect: "",
    operativeEffect: "",
    effectiveness: "",
    weighting: "25",
    isKeyControl: false,
    category: "detective",
    comments: ""
  }
];

const ControlEffectivenessSection = ({ onNext }: { onNext: () => void }) => {
  const [controls, setControls] = useState<Control[]>(DEFAULT_CONTROLS);
  const { updateForm } = useForm();

  const handleAddControl = () => {
    const newId = (controls.length + 1).toString();
    const newControlId = `CTL-${String(controls.length + 1).padStart(3, '0')}`;
    setControls([
      ...controls,
      {
        id: newId,
        controlId: newControlId,
        name: "",
        designEffect: "",
        operativeEffect: "",
        effectiveness: "",
        weighting: "0",
        isKeyControl: false,
        category: "",
        comments: ""
      }
    ]);
  };

  const handleRemoveControl = (id: string) => {
    if (controls.length <= 1) return;
    setControls(controls.filter(control => control.id !== id));
  };

  const handleControlChange = (id: string, field: keyof Control, value: any) => {
    const updatedControls = controls.map(control => 
      control.id === id ? { ...control, [field]: value } : control
    );
    setControls(updatedControls);
    updateForm({ controls: updatedControls });
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-md">
        <h2 className="text-xl font-medium text-purple-800 mb-2">Control Effectiveness</h2>
        <p className="text-purple-700 text-sm">Evaluate the quality of controls applied to mitigate the risk.</p>
      </div>
      
      <div className="space-y-4">
        {controls.map((control) => (
          <div key={control.id} className="border rounded-md p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor={`control-id-${control.id}`}>Control ID</Label>
                <Input
                  id={`control-id-${control.id}`}
                  value={control.controlId}
                  onChange={(e) => handleControlChange(control.id, "controlId", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor={`control-name-${control.id}`}>Control Name</Label>
                <Input
                  id={`control-name-${control.id}`}
                  value={control.name}
                  onChange={(e) => handleControlChange(control.id, "name", e.target.value)}
                  className="mt-1"
                  placeholder="Enter control name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
              <div className="md:col-span-2">
                <Label htmlFor={`design-effect-${control.id}`}>Design Effectiveness</Label>
                <Select
                  value={control.designEffect}
                  onValueChange={(value) => handleControlChange(control.id, "designEffect", value)}
                >
                  <SelectTrigger id={`design-effect-${control.id}`} className="mt-1">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ineffective">Ineffective</SelectItem>
                    <SelectItem value="partially">Partially Effective</SelectItem>
                    <SelectItem value="effective">Effective</SelectItem>
                    <SelectItem value="highly">Highly Effective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor={`operative-effect-${control.id}`}>Operating Effectiveness</Label>
                <Select
                  value={control.operativeEffect}
                  onValueChange={(value) => handleControlChange(control.id, "operativeEffect", value)}
                >
                  <SelectTrigger id={`operative-effect-${control.id}`} className="mt-1">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ineffective">Ineffective</SelectItem>
                    <SelectItem value="partially">Partially Effective</SelectItem>
                    <SelectItem value="effective">Effective</SelectItem>
                    <SelectItem value="highly">Highly Effective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor={`effectiveness-${control.id}`}>Overall Effectiveness</Label>
                <Select
                  value={control.effectiveness}
                  onValueChange={(value) => handleControlChange(control.id, "effectiveness", value)}
                >
                  <SelectTrigger id={`effectiveness-${control.id}`} className="mt-1">
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
                <Label htmlFor={`weighting-${control.id}`}>Weight (%)</Label>
                <Input
                  id={`weighting-${control.id}`}
                  type="number"
                  min="0"
                  max="100"
                  value={control.weighting}
                  onChange={(e) => handleControlChange(control.id, "weighting", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-1 flex items-end justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveControl(control.id)}
                  disabled={controls.length <= 1}
                  className="text-red-500 h-9 w-9"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              <div className="md:col-span-1 flex items-center space-x-2">
                <Checkbox 
                  id={`key-control-${control.id}`} 
                  checked={control.isKeyControl}
                  onCheckedChange={(checked) => 
                    handleControlChange(control.id, "isKeyControl", checked === true)
                  }
                />
                <Label
                  htmlFor={`key-control-${control.id}`}
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Key Control
                </Label>
              </div>
              
              <div className="md:col-span-3">
                <Label htmlFor={`category-${control.id}`}>Control Category</Label>
                <Select
                  value={control.category}
                  onValueChange={(value) => handleControlChange(control.id, "category", value)}
                >
                  <SelectTrigger id={`category-${control.id}`} className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="detective">Detective</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="directive">Directive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-4">
                <Label htmlFor={`comments-${control.id}`}>Comments</Label>
                <Textarea
                  id={`comments-${control.id}`}
                  value={control.comments}
                  onChange={(e) => handleControlChange(control.id, "comments", e.target.value)}
                  className="mt-1 min-h-[60px]"
                  placeholder="Add comments about this control"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddControl}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Control
        </Button>
        
        <Button onClick={onNext}>Continue to Residual Rating</Button>
      </div>
    </div>
  );
};

export default ControlEffectivenessSection;
