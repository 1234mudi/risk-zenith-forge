import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff, LineChart, Shield, Sparkles, Info } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Control, ControlLibraryItem } from "@/types/control-types";
import { calculateControlScore } from "@/utils/control-utils";
import ControlLibraryDialog from "./controls/ControlLibraryDialog";
import ControlGrid from "./controls/ControlGrid";
import PreviousAssessmentsSection from "./PreviousAssessmentsSection";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import EditableGrid from "@/components/ui/editable-grid";
import { SectionHeader } from "@/components/collaboration/SectionHeader";
import { useAIAutofill } from "@/hooks/useAIAutofill";
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
    owner: "Michael Brown",
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
    owner: "Sarah Johnson",
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
        owner: "Michael Brown",
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
        owner: "Sarah Johnson",
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
        owner: "Michael Brown",
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
        owner: "Sarah Johnson",
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
        owner: "Michael Brown",
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
        owner: "Sarah Johnson",
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
        owner: "Michael Brown",
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
        owner: "Sarah Johnson",
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
        owner: "Michael Brown",
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
        owner: "Sarah Johnson",
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

const ControlEffectivenessSection = ({ onNext, showWeights }: ControlEffectivenessSectionProps) => {
  // Pre-fill from the most recent previous assessment
  const previousAssessmentControls = SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS[0]?.controls || DEFAULT_CONTROLS;
  const previousAssessmentScore = SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS[0]?.score || "0.0";
  
  const [controls, setControls] = useState<Control[]>(previousAssessmentControls);
  const { updateForm, formState } = useForm();
  const [overallScore, setOverallScore] = useState<string>(formState.controlEffectivenessScore || previousAssessmentScore);
  const [localShowWeights, setLocalShowWeights] = useState(showWeights);
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [controlTrendData, setControlTrendData] = useState(SAMPLE_HISTORICAL_CONTROL_ASSESSMENTS.map(assessment => ({
    date: assessment.date,
    score: parseFloat(assessment.score),
    result: assessment.controls[0]?.testResults?.result || 'not tested'
  })));

  const { autofillRating, autofillComment, autofillAll, isLoading, isCellLoading, loadingCells } = useAIAutofill();

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
        comments: "",
        testResults: {
          lastTested: "",
          result: "",
          tester: "",
          findings: ""
        }
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
        comments: libraryControl.description,
        testResults: {
          lastTested: "",
          result: "",
          tester: "",
          findings: ""
        }
      }
    ]);
  };

  const handleRemoveControl = (rowIndex: number) => {
    if (controls.length <= 1) return;
    const controlToRemove = controls[rowIndex];
    setControls(controls.filter(control => control.id !== controlToRemove.id));
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

  const handleAIAutofill = async (rowIndex: number, field: string, aiType: 'rating' | 'comment') => {
    const rowData = controls[rowIndex];
    
    const context = {
      factorName: rowData.name,
      description: `Control ID: ${rowData.controlId}, Category: ${rowData.category}, Design: ${rowData.designEffect}, Operating: ${rowData.operativeEffect}`,
      riskContext: 'Control effectiveness assessment for enterprise risk management',
      rating: rowData.effectiveness
    };

    if (aiType === 'rating') {
      const rating = await autofillRating(context);
      if (rating) {
        const newControls = [...controls];
        newControls[rowIndex] = {
          ...newControls[rowIndex],
          effectiveness: rating
        };
        setControls(newControls);
        updateForm({ controls: newControls });
      }
    } else if (aiType === 'comment') {
      const comment = await autofillComment(context);
      if (comment) {
        const newControls = [...controls];
        newControls[rowIndex] = {
          ...newControls[rowIndex],
          comments: comment
        };
        setControls(newControls);
        updateForm({ controls: newControls });
      }
    }
  };

  const handleAIAutofillAll = async () => {
    const allControls = controls.map(control => ({
      id: control.id,
      name: control.name,
      description: `Control ID: ${control.controlId}, Category: ${control.category}, Design: ${control.designEffect}, Operating: ${control.operativeEffect}`
    }));

    const results = await autofillAll({
      riskContext: 'Control effectiveness assessment for enterprise risk management',
      factors: allControls
    });

    if (results && Array.isArray(results)) {
      const newControls = controls.map(control => {
        const result = results.find((r: any) => r.id === control.id);
        if (result) {
          return {
            ...control,
            effectiveness: result.rating ? result.rating.toString() : control.effectiveness,
            comments: result.comment || control.comments
          };
        }
        return control;
      });
      setControls(newControls);
      updateForm({ controls: newControls });
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader 
        title="Control Effectiveness" 
        sectionId="control"
        icon={<Shield className="h-5 w-5 text-green-600" />}
      />
      
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
      
      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md border">
        <div>
          <h3 className="font-medium text-slate-700 text-sm">Overall Control Effectiveness</h3>
          <p className="text-xs text-slate-500">Calculated based on weighted controls</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTrendChart(!showTrendChart)}
            className="flex items-center gap-1 h-8 text-xs"
          >
            <LineChart className="h-3.5 w-3.5" />
            {showTrendChart ? "Hide Trend" : "Show Trend"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleWeights}
            className="flex items-center gap-1 h-8 text-xs"
          >
            {localShowWeights ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {localShowWeights ? "Hide Weights" : "Show Weights"}
          </Button>
          <div className={`px-3 py-1.5 rounded border ${getScoreColor(overallScore)}`}>
            <div className="text-xs font-medium">Score: {overallScore}</div>
            <div className="text-[10px] font-semibold">{getScoreLabel(overallScore)}</div>
          </div>
        </div>
      </div>
      
      {showTrendChart && (
        <Card className="p-3 border">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={controlTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="score" fill="#8884d8" name="Control Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Control
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Control</DialogTitle>
              </DialogHeader>
              <div className="mt-3 space-y-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddControl}
                  className="w-full justify-start"
                >
                  <Plus className="h-3.5 w-3.5 mr-2" /> Add Blank Control
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleAddFromLibrary(CONTROL_LIBRARY[0])}
                >
                  <Plus className="h-3.5 w-3.5 mr-2" /> Add from Control Library
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <ControlLibraryDialog
            controls={CONTROL_LIBRARY}
            onAddFromLibrary={handleAddFromLibrary}
          />
        </div>
        
        <Button 
          onClick={handleAIAutofillAll}
          disabled={isLoading}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-8 text-xs"
        >
          {isLoading ? (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
              AI Autofilling...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              AI Autofill All
            </>
          )}
        </Button>
      </div>
      
      {/* Pre-filled info note */}
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
        <Info className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <span className="text-xs text-slate-500">Pre-filled from previous assessment. You may update if required.</span>
      </div>
      
      <EditableGrid
        columns={[
          { field: 'controlId', header: 'Control ID', width: '120px', editable: true },
          { field: 'name', header: 'Control Name', editable: true },
          { field: 'category', header: 'Category', type: 'select', editable: true, 
            options: [
              { value: 'preventive', label: 'Preventive' },
              { value: 'detective', label: 'Detective' },
              { value: 'corrective', label: 'Corrective' },
              { value: 'directive', label: 'Directive' }
            ]
          },
          { field: 'designEffect', header: 'Design', type: 'select', editable: true,
            options: [
              { value: 'ineffective', label: 'Ineffective', className: 'text-red-500' },
              { value: 'partially', label: 'Partially Effective', className: 'text-orange-500' },
              { value: 'effective', label: 'Effective', className: 'text-green-500' },
              { value: 'highly', label: 'Highly Effective', className: 'text-green-600 font-semibold' }
            ]
          },
          { field: 'operativeEffect', header: 'Operating', type: 'select', editable: true,
            options: [
              { value: 'ineffective', label: 'Ineffective', className: 'text-red-500' },
              { value: 'partially', label: 'Partially Effective', className: 'text-orange-500' },
              { value: 'effective', label: 'Effective', className: 'text-green-500' },
              { value: 'highly', label: 'Highly Effective', className: 'text-green-600 font-semibold' }
            ]
          },
          { field: 'effectiveness', header: 'Overall', type: 'rating', editable: true, enableAI: true, aiType: 'rating' },
          { field: 'testResults.result', header: 'Control Test Results', type: 'select', editable: true,
            options: [
              { value: 'effective', label: 'Effective', className: 'text-green-500' },
              { value: 'partially', label: 'Partially Effective', className: 'text-orange-500' },
              { value: 'ineffective', label: 'Ineffective', className: 'text-red-500' }
            ]
          },
          { field: 'testResults.tester', header: 'Control Tester', editable: true },
          { field: 'testResults.lastTested', header: 'Last Tested On', type: 'date', editable: true },
          { field: 'owner', header: 'Control Owner', editable: true },
          { field: 'weighting', header: 'Factor Weightage (%)', type: 'number', editable: true },
          { field: 'evidence', header: 'Evidences', type: 'fileUpload', editable: false },
          { field: 'comments', header: 'Comments', type: 'textarea', editable: true, enableAI: true, aiType: 'comment' }
        ]}
        data={controls}
        onDataChange={(newData) => {
          setControls(newData);
          updateForm({ controls: newData });
        }}
        keyField="id"
        onAddRow={handleAddControl}
        onRemoveRow={handleRemoveControl}
        onAIAutofill={handleAIAutofill}
        aiLoadingCells={loadingCells}
        className="border-collapse [&_th]:bg-yellow-50 [&_td]:border [&_th]:border [&_th]:border-slate-200 [&_td]:border-slate-200"
        allowBulkEdit={true}
      />
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Residual Rating</Button>
      </div>
    </div>
  );
};

export default ControlEffectivenessSection;
