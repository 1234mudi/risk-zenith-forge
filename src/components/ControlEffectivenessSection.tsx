import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff, LineChart } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Control, ControlLibraryItem } from "@/types/control-types";
import { calculateControlScore } from "@/utils/control-utils";
import ControlLibraryDialog from "./controls/ControlLibraryDialog";
import ControlGrid from "./controls/ControlGrid";
import PreviousAssessmentsSection from "./PreviousAssessmentsSection";

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

const SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS = [
  {
    date: "2024-03-15",
    score: "2.3",
    controls: [
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
    ]
  },
  {
    date: "2023-12-10",
    score: "2.5",
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "partially",
        operativeEffect: "partially",
        effectiveness: "3",
        weighting: "25",
        isKeyControl: true,
        category: "preventive",
        comments: "Some issues with access provisioning",
        testResults: {
          lastTested: "2023-11-10",
          result: "partial",
          tester: "John Smith",
          findings: "Several improvement areas identified"
        }
      },
      {
        id: "2",
        controlId: "CTL-002",
        name: "Change Management Process",
        designEffect: "effective",
        operativeEffect: "partially",
        effectiveness: "2",
        weighting: "25",
        isKeyControl: false,
        category: "detective",
        comments: "Process needs more rigorous implementation",
        testResults: {
          lastTested: "2023-11-15",
          result: "partial",
          tester: "Emily Johnson",
          findings: "Documentation was incomplete"
        }
      }
    ]
  },
  {
    date: "2023-09-05",
    score: "2.8",
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "partially",
        operativeEffect: "ineffective",
        effectiveness: "4",
        weighting: "25",
        isKeyControl: true,
        category: "preventive",
        comments: "Multiple issues with access management",
        testResults: {
          lastTested: "2023-08-20",
          result: "fail",
          tester: "John Smith",
          findings: "Major concerns with privileged access"
        }
      },
      {
        id: "2",
        controlId: "CTL-002",
        name: "Change Management Process",
        designEffect: "partially",
        operativeEffect: "partially",
        effectiveness: "3",
        weighting: "25",
        isKeyControl: false,
        category: "detective",
        comments: "Process needs significant improvements",
        testResults: {
          lastTested: "2023-08-15",
          result: "partial",
          tester: "Emily Johnson",
          findings: "Several control weaknesses identified"
        }
      }
    ]
  },
  {
    date: "2023-06-20",
    score: "3.0",
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "ineffective",
        operativeEffect: "ineffective",
        effectiveness: "4",
        weighting: "25",
        isKeyControl: true,
        category: "preventive",
        comments: "Control not performing as expected",
        testResults: {
          lastTested: "2023-05-15",
          result: "fail",
          tester: "John Smith",
          findings: "Significant control failures"
        }
      },
      {
        id: "2",
        controlId: "CTL-002",
        name: "Change Management Process",
        designEffect: "partially",
        operativeEffect: "ineffective",
        effectiveness: "3",
        weighting: "25",
        isKeyControl: false,
        category: "detective",
        comments: "Process not being followed consistently",
        testResults: {
          lastTested: "2023-05-20",
          result: "partial",
          tester: "Emily Johnson",
          findings: "Inconsistent application of control"
        }
      }
    ]
  },
  {
    date: "2023-03-12",
    score: "3.2",
    controls: [
      {
        id: "1",
        controlId: "CTL-001",
        name: "Access Control Management",
        designEffect: "ineffective",
        operativeEffect: "ineffective",
        effectiveness: "4",
        weighting: "25",
        isKeyControl: true,
        category: "preventive",
        comments: "Control design and implementation need overhaul",
        testResults: {
          lastTested: "2023-02-10",
          result: "fail",
          tester: "John Smith",
          findings: "Multiple control issues found"
        }
      },
      {
        id: "2",
        controlId: "CTL-002",
        name: "Change Management Process",
        designEffect: "ineffective",
        operativeEffect: "partially",
        effectiveness: "3",
        weighting: "25",
        isKeyControl: false,
        category: "detective",
        comments: "Process design has fundamental issues",
        testResults: {
          lastTested: "2023-02-15",
          result: "fail",
          tester: "Emily Johnson",
          findings: "Control not achieving objectives"
        }
      }
    ]
  }
];

type ControlEffectivenessSectionProps = {
  onNext: () => void;
  showWeights: boolean;
};

const ControlEffectivenessSection = ({ 
  onNext, 
  showWeights
}: ControlEffectivenessSectionProps) => {
  const [controls, setControls] = useState<Control[]>(DEFAULT_CONTROLS);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.controlEffectivenessScore || "0.0");
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showTrendChart, setShowTrendChart] = useState(false);
  
  const assessmentHistory = SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS.map(assessment => ({
    date: assessment.date,
    score: assessment.score
  }));

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
    if (SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS.length > 0) {
      const latestAssessment = SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS[0];
      setControls(latestAssessment.controls);
      updateForm({ controls: latestAssessment.controls });
      setOverallScore(latestAssessment.score);
      updateForm({ controlEffectivenessScore: latestAssessment.score });
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

  const getRatingColor = (value: string) => {
    const numValue = parseInt(value || "0");
    if (numValue >= 4) return "text-red-600 bg-red-50 px-2 py-1 rounded";
    if (numValue >= 3) return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
    if (numValue >= 2) return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
    return "text-green-600 bg-green-50 px-2 py-1 rounded";
  };

  return (
    <div className="space-y-6">
      <PreviousAssessmentsSection
        title="Previous Control Effectiveness Assessments"
        assessmentHistory={assessmentHistory}
        controls={SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS[0]?.controls}
        showWeights={localShowWeights}
        onCopyLatest={copyFromPrevious}
        getScoreColor={getScoreColor}
        getScoreLabel={getScoreLabel}
        getRatingColor={getRatingColor}
        type="control"
      />
      
      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700">Overall Control Effectiveness</h3>
          <p className="text-sm text-slate-500">Calculated based on weighted controls</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTrendChart(!showTrendChart)}
            className="flex items-center gap-1"
          >
            <LineChart className="h-4 w-4" />
            {showTrendChart ? "Hide Control Trend" : "Show Control Trend"}
          </Button>
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
      
      {showTrendChart && (
        <Card className="p-4 border">
          <div className="h-64 flex items-center justify-center border rounded">
            <LineChart className="h-6 w-6 text-slate-300" />
            <span className="ml-2 text-slate-500">Control Effectiveness Trend Chart Placeholder</span>
          </div>
        </Card>
      )}
      
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
