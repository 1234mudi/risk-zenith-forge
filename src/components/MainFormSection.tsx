
import React from "react";
import { useForm } from "@/contexts/FormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrganizationInfo from "./assessment-context/OrganizationInfo";
import AssessableItemInfo from "./assessment-context/AssessableItemInfo";
import RiskInfo from "./assessment-context/RiskInfo";
import AssessmentGuidance from "./assessment-context/AssessmentGuidance";

const MainFormSection = ({ onNext }: { onNext: () => void }) => {
  const { updateForm, formState } = useForm();

  return (
    <div className="space-y-6">
      {/* Organization and Risk Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrganizationInfo 
          organization={formState.organization} 
          onOrganizationChange={(value) => updateForm({ organization: value })}
        />
        <AssessableItemInfo 
          assessableItem={formState.assessableItem}
          onAssessableItemChange={(value) => updateForm({ assessableItem: value })}
        />
      </div>

      {/* Risk Information */}
      <RiskInfo 
        risk={formState.risk}
        riskHierarchy={formState.riskHierarchy}
        riskIdDisplay={formState.riskIdDisplay}
        onRiskChange={(value) => updateForm({ risk: value })}
        onRiskHierarchyChange={(value) => updateForm({ riskHierarchy: value })}
      />

      {/* Assessment Guidance */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentGuidance 
            scope={formState.scope || ""} 
            instructions={formState.instructions || ""}
            onScopeChange={(value) => updateForm({ scope: value })}
            onInstructionsChange={(value) => updateForm({ instructions: value })}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button onClick={onNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Continue to Inherent Rating
        </button>
      </div>
    </div>
  );
};

export default MainFormSection;
