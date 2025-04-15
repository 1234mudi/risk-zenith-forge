import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Search, X, Eye, EyeOff, ExternalLink, Copy, Clock } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  testResults?: {
    lastTested: string;
    result: string;
    tester: string;
    findings: string;
  }
};

const DEFAULT_CONTROLS: Control[] = [
  {
    id: "1",
    controlId: "CTL-001",
    name: "Access Control Management",
    designEffect: "effective",
    operativeEffect: "partially",
    effectiveness: "3",
    weighting: "25",
    isKeyControl: true,
    category: "preventive",
    comments: "Works well in most cases",
    testResults: {
      lastTested: "2023-12-15",
      result: "pass",
      tester: "John Smith",
      findings: "No significant issues found"
    }
  },
  {
    id: "2",
    controlId: "CTL-002",
    name: "Change Management Process",
    designEffect: "highly",
    operativeEffect: "effective",
    effectiveness: "2",
    weighting: "25",
    isKeyControl: false,
    category: "detective",
    comments: "Well designed but some implementation issues",
    testResults: {
      lastTested: "2024-01-20",
      result: "partial",
      tester: "Emily Johnson",
      findings: "Some approvals were missing"
    }
  }
];

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

type ControlEffectivenessSectionProps = {
  onNext: () => void;
  showWeights: boolean;
  previousControls?: Control[];
  previousScore?: string;
  previousDate?: string;
};

const ControlEffectivenessSection = ({ 
  onNext, 
  showWeights,
  previousControls = [],
  previousScore = "0.0",
  previousDate = "",
}: ControlEffectivenessSectionProps) => {
  const [controls, setControls] = useState<Control[]>(DEFAULT_CONTROLS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.controlEffectivenessScore || "0.0");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredControls, setFilteredControls] = useState(CONTROL_LIBRARY);
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showPreviousAssessment, setShowPreviousAssessment] = useState(false);

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
    if (numScore >= 4) return "bg-red-100 text-red-700 border-red-200";
    if (numScore >= 3) return "bg-orange-100 text-orange-700 border-orange-200";
    if (numScore >= 2) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
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
    if (numValue >= 4) return "text-red-600 bg-red-50 px-2 py-1 rounded";
    if (numValue >= 3) return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
    if (numValue >= 2) return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
    return "text-green-600 bg-green-50 px-2 py-1 rounded";
  };

  const getCellColor = (value: string) => {
    const numValue = parseInt(value || "0");
    if (numValue >= 4) return "bg-red-50";
    if (numValue >= 3) return "bg-orange-50";
    if (numValue >= 2) return "bg-yellow-50";
    return "bg-green-50";
  };

  const getEffectivenessColor = (value: string) => {
    if (value === "ineffective") return "text-red-600 bg-red-50 px-2 py-1 rounded";
    if (value === "partially") return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
    if (value === "effective") return "text-green-600 bg-green-50 px-2 py-1 rounded";
    if (value === "highly") return "text-green-700 bg-green-100 px-2 py-1 rounded font-semibold";
    return "";
  };

  const getTestResultColor = (result: string) => {
    if (result === "fail") return "text-red-600 bg-red-50 px-2 py-1 rounded";
    if (result === "partial") return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
    if (result === "pass") return "text-green-600 bg-green-50 px-2 py-1 rounded";
    return "";
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

  const toggleWeights = () => {
    setLocalShowWeights(!localShowWeights);
    updateForm({ showWeights: !localShowWeights });
  };

  const copyFromPrevious = () => {
    if (previousControls && previousControls.length > 0) {
      setControls(previousControls);
      updateForm({ controls: previousControls });
      calculateScore(previousControls);
    }
  };

  return (
    <div className="space-y-6">
      {previousControls && previousControls.length > 0 && (
        <Collapsible 
          defaultOpen={false}
          open={showPreviousAssessment} 
          onOpenChange={setShowPreviousAssessment}
          className="border rounded-md overflow-hidden"
        >
          <div className="bg-slate-50 p-3 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-500" />
              <h3 className="font-medium text-slate-700">Previous Assessment</h3>
              <Badge variant="outline" className="text-xs">
                {previousDate}
              </Badge>
              <Badge className={getScoreColor(previousScore)}>
                Score: {previousScore} ({getScoreLabel(previousScore)})
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyFromPrevious}
                className="flex items-center gap-1"
              >
                <Copy size={14} />
                <span>Copy results to current assessment</span>
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {showPreviousAssessment ? "Hide" : "Show"}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="p-4 space-y-4 bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control ID</TableHead>
                    <TableHead>Control Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Design Effectiveness</TableHead>
                    <TableHead>Operating Effectiveness</TableHead>
                    <TableHead>Overall Rating</TableHead>
                    {localShowWeights && <TableHead>Weight (%)</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousControls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-mono text-xs">{control.controlId}</TableCell>
                      <TableCell className="font-medium">{control.name}</TableCell>
                      <TableCell className="capitalize">
                        {control.category === "preventive" && <Badge variant="outline" className="bg-blue-50">Preventive</Badge>}
                        {control.category === "detective" && <Badge variant="outline" className="bg-purple-50">Detective</Badge>}
                        {control.category === "corrective" && <Badge variant="outline" className="bg-green-50">Corrective</Badge>}
                        {control.category === "directive" && <Badge variant="outline" className="bg-yellow-50">Directive</Badge>}
                      </TableCell>
                      <TableCell>
                        <span className={getEffectivenessColor(control.designEffect)}>
                          {control.designEffect === "ineffective" ? "Ineffective" : 
                           control.designEffect === "partially" ? "Partially Effective" : 
                           control.designEffect === "effective" ? "Effective" : 
                           control.designEffect === "highly" ? "Highly Effective" : "Not Rated"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getEffectivenessColor(control.operativeEffect)}>
                          {control.operativeEffect === "ineffective" ? "Ineffective" : 
                           control.operativeEffect === "partially" ? "Partially Effective" : 
                           control.operativeEffect === "effective" ? "Effective" : 
                           control.operativeEffect === "highly" ? "Highly Effective" : "Not Rated"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getRatingColor(control.effectiveness)}>
                          {control.effectiveness === "1" ? "Very Low (1)" : 
                           control.effectiveness === "2" ? "Low (2)" : 
                           control.effectiveness === "3" ? "Medium (3)" : 
                           control.effectiveness === "4" ? "High (4)" : 
                           control.effectiveness === "5" ? "Very High (5)" : "Not Rated"}
                        </span>
                      </TableCell>
                      {localShowWeights && (
                        <TableCell>{control.weighting}%</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700">Overall Control Effectiveness</h3>
          <p className="text-sm text-slate-500">Calculated based on weighted controls</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleWeights}
            className="flex items-center gap-1"
          >
            {localShowWeights ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {localShowWeights ? "Hide Weights" : "Show Weights"}
          </Button>
          <div className={`px-4 py-2 rounded border ${getScoreColor(overallScore)}`}>
            <div className="text-sm font-medium">Score: {overallScore}</div>
            <div className="text-xs font-semibold">{getScoreLabel(overallScore)}</div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Control
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Control</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <Button 
                variant="outline" 
                onClick={handleAddControl}
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Blank Control
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => handleAddFromLibrary(CONTROL_LIBRARY[0])}
              >
                <Search className="h-4 w-4 mr-2" /> Add from Control Library
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" /> Control Library
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
              {localShowWeights && <TableHead>Weight (%)</TableHead>}
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
                      onChange={(e) => handleControlChange(control.id, "controlId", e.target.value)}
                      className="font-mono text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={control.name}
                      onChange={(e) => handleControlChange(control.id, "name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={control.category}
                      onValueChange={(value) => handleControlChange(control.id, "category", value)}
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
                      onValueChange={(value) => handleControlChange(control.id, "designEffect", value)}
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
                      onValueChange={(value) => handleControlChange(control.id, "operativeEffect", value)}
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
                      onValueChange={(value) => handleControlChange(control.id, "effectiveness", value)}
                    >
                      <SelectTrigger className={`w-full ${getCellColor(control.effectiveness)}`}>
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
                        value={control.weighting}
                        onChange={(e) => handleControlChange(control.id, "weighting", e.target.value)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex space-x-1">
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
                                onChange={(e) => handleControlChange(control.id, "comments", e.target.value)}
                                className="min-h-[80px] mt-1"
                                placeholder="Add comments about this control"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`key-control-${control.id}`} 
                                checked={control.isKeyControl}
                                onCheckedChange={(checked) => 
                                  handleControlChange(control.id, "isKeyControl", checked === true)
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveControl(control.id)}
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
                    <TableCell colSpan={localShowWeights ? 8 : 7} className="bg-slate-50 py-2 px-4">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Latest Test:</span> 
                          <span>{control.testResults.lastTested}</span>
                          <span className="font-medium ml-2">Tester:</span> 
                          <span>{control.testResults.tester}</span>
                        </div>
                        <Badge className={getTestResultColor(control.testResults.result)}>
                          {control.testResults.result === "pass" ? "Passed" : 
                           control.testResults.result === "partial" ? "Partially Passed" : "Failed"}
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
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Residual Rating</Button>
      </div>
    </div>
  );
};

export default ControlEffectivenessSection;
