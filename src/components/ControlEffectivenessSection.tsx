import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff, Clock, Copy } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Control, ControlLibraryItem } from "@/types/control-types";
import { calculateControlScore } from "@/utils/control-utils";
import ControlLibraryDialog from "./controls/ControlLibraryDialog";
import ControlGrid from "./controls/ControlGrid";

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

const CONTROL_LIBRARY: ControlLibraryItem[] = [
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

  const handleAddFromLibrary = (libraryControl: ControlLibraryItem) => {
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
    
    const score = calculateControlScore(updatedControls);
    setOverallScore(score);
    updateForm({ controlEffectivenessScore: score });
  };

  const toggleWeights = () => {
    setLocalShowWeights(!localShowWeights);
    updateForm({ showWeights: !localShowWeights });
  };

  const copyFromPrevious = () => {
    if (previousControls && previousControls.length > 0) {
      setControls(previousControls);
      updateForm({ controls: previousControls });
      const score = calculateControlScore(previousControls);
      setOverallScore(score);
      updateForm({ controlEffectivenessScore: score });
    }
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
              <ControlGrid 
                controls={previousControls}
                onUpdateControl={() => {}} // Read-only for previous controls
                onRemoveControl={() => {}} // Read-only for previous controls
                showWeights={localShowWeights}
              />
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
                <Plus className="h-4 w-4 mr-2" /> Add from Control Library
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <ControlLibraryDialog
          controls={CONTROL_LIBRARY}
          onAddFromLibrary={handleAddFromLibrary}
        />
      </div>
      
      <ControlGrid 
        controls={controls}
        onUpdateControl={handleControlChange}
        onRemoveControl={handleRemoveControl}
        showWeights={localShowWeights}
      />
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Residual Rating</Button>
      </div>
    </div>
  );
};

export default ControlEffectivenessSection;
