
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Search, X } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

// Sample control library for lookup
const CONTROL_LIBRARY = [
  { id: "CTL-003", name: "Segregation of Duties", category: "preventive", description: "Ensures that critical tasks are divided among different individuals to prevent fraud and errors." },
  { id: "CTL-004", name: "Automated Data Validation", category: "detective", description: "System checks that validate data inputs against predefined rules." },
  { id: "CTL-005", name: "Periodic Reconciliation", category: "detective", description: "Regular comparison of two sets of records to ensure accuracy." },
  { id: "CTL-006", name: "Management Review", category: "detective", description: "Review of processes, decisions, or outputs by management." },
  { id: "CTL-007", name: "Audit Trail", category: "detective", description: "Chronological record of system activities." },
  { id: "CTL-008", name: "Authorization Controls", category: "preventive", description: "Ensures that transactions are approved by appropriate personnel." },
  { id: "CTL-009", name: "Business Continuity Planning", category: "corrective", description: "Plans to ensure operations can continue in case of disruption." },
  { id: "CTL-010", name: "Encryption", category: "preventive", description: "Protects data by converting it into coded format." },
];

const ControlEffectivenessSection = ({ onNext, showWeights = true }: { onNext: () => void; showWeights?: boolean }) => {
  const [controls, setControls] = useState<Control[]>(DEFAULT_CONTROLS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>("0.0");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredControls, setFilteredControls] = useState(CONTROL_LIBRARY);

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

  const handleAddFromLibrary = (libraryControl) => {
    const newId = (controls.length + 1).toString();
    setControls([
      ...controls,
      {
        id: newId,
        controlId: libraryControl.id,
        name: libraryControl.name,
        designEffect: "",
        operativeEffect: "",
        effectiveness: "",
        weighting: "25",
        isKeyControl: false,
        category: libraryControl.category,
        comments: libraryControl.description
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
    calculateScore(updatedControls);
  };

  const calculateScore = (controlsList: Control[]) => {
    let total = 0;
    let weightSum = 0;
    
    controlsList.forEach(control => {
      if (control.effectiveness && control.weighting) {
        total += Number(control.effectiveness) * (Number(control.weighting) / 100);
        weightSum += Number(control.weighting);
      }
    });
    
    const score = weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
    setOverallScore(score);
    updateForm({ controlEffectivenessScore: score });
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score || "0");
    if (numScore >= 4) return "bg-red-50 text-red-600 border-red-200";
    if (numScore >= 3) return "bg-orange-50 text-orange-600 border-orange-200";
    if (numScore >= 2) return "bg-yellow-50 text-yellow-600 border-yellow-200";
    return "bg-green-50 text-green-600 border-green-200";
  };

  const getScoreLabel = (score: string) => {
    const numScore = parseFloat(score || "0");
    if (numScore >= 4) return "High";
    if (numScore >= 3) return "Medium";
    if (numScore >= 2) return "Low";
    return "Very Low";
  };

  const getRatingColor = (value: string) => {
    const numValue = parseInt(value || "0");
    if (numValue >= 4) return "text-red-500";
    if (numValue >= 3) return "text-orange-500";
    if (numValue >= 2) return "text-yellow-500";
    return "text-green-500";
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = CONTROL_LIBRARY.filter(
      control => 
        control.name.toLowerCase().includes(term.toLowerCase()) ||
        control.id.toLowerCase().includes(term.toLowerCase()) ||
        control.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredControls(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-md">
        <h2 className="text-xl font-medium text-purple-800 mb-2">Control Effectiveness</h2>
        <p className="text-purple-700 text-sm">Evaluate the quality of controls applied to mitigate the risk.</p>
      </div>
      
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700">Overall Control Effectiveness</h3>
          <p className="text-sm text-slate-500">Calculated based on weighted controls</p>
        </div>
        <div className={`px-4 py-2 rounded border ${getScoreColor(overallScore)}`}>
          <div className="text-sm font-medium">Score: {overallScore}</div>
          <div className="text-xs font-semibold">{getScoreLabel(overallScore)}</div>
        </div>
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" /> Add from Control Library
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Control Library</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search controls..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                    onClick={() => handleSearch("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">ID</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">Control Name</th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">Category</th>
                      <th className="px-4 py-2 text-center font-medium text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredControls.map((control) => (
                      <tr key={control.id}>
                        <td className="px-4 py-3 font-mono text-xs">{control.id}</td>
                        <td className="px-4 py-3">{control.name}</td>
                        <td className="px-4 py-3 capitalize">{control.category}</td>
                        <td className="px-4 py-3 text-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              handleAddFromLibrary(control);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredControls.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                          No controls found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            
            <div className={`grid grid-cols-1 md:grid-cols-${showWeights ? "8" : "7"} gap-4 mb-4`}>
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
                    <SelectItem value="ineffective" className="text-red-500">Ineffective</SelectItem>
                    <SelectItem value="partially" className="text-orange-500">Partially Effective</SelectItem>
                    <SelectItem value="effective" className="text-green-500">Effective</SelectItem>
                    <SelectItem value="highly" className="text-green-600 font-semibold">Highly Effective</SelectItem>
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
                    <SelectItem value="ineffective" className="text-red-500">Ineffective</SelectItem>
                    <SelectItem value="partially" className="text-orange-500">Partially Effective</SelectItem>
                    <SelectItem value="effective" className="text-green-500">Effective</SelectItem>
                    <SelectItem value="highly" className="text-green-600 font-semibold">Highly Effective</SelectItem>
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
                    <SelectItem value="1" className="text-green-500">Very Low (1)</SelectItem>
                    <SelectItem value="2" className="text-yellow-500">Low (2)</SelectItem>
                    <SelectItem value="3" className="text-orange-500">Medium (3)</SelectItem>
                    <SelectItem value="4" className="text-red-500">High (4)</SelectItem>
                    <SelectItem value="5" className="text-red-600 font-semibold">Very High (5)</SelectItem>
                  </SelectContent>
                </Select>
                {control.effectiveness && (
                  <div className={`text-xs font-medium mt-1 ${getRatingColor(control.effectiveness)}`}>
                    {control.effectiveness === "1" ? "Very Low" : 
                     control.effectiveness === "2" ? "Low" : 
                     control.effectiveness === "3" ? "Medium" : 
                     control.effectiveness === "4" ? "High" : 
                     control.effectiveness === "5" ? "Very High" : ""}
                  </div>
                )}
              </div>
              
              {showWeights && (
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
              )}
              
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
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Residual Rating</Button>
      </div>
    </div>
  );
};

export default ControlEffectivenessSection;
