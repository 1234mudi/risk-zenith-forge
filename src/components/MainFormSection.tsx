
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@/contexts/FormContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import OrganizationInfo from "./assessment-context/OrganizationInfo";
import AssessableItemInfo from "./assessment-context/AssessableItemInfo";
import RiskInfo from "./assessment-context/RiskInfo";
import AssessmentGuidance from "./assessment-context/AssessmentGuidance";

const MainFormSection = ({ onNext }: { onNext: () => void }) => {
  const { formState, updateForm } = useForm();
  const [isOpenRiskDef, setIsOpenRiskDef] = useState(true);
  const [isOpenGuidance, setIsOpenGuidance] = useState(true);
  
  return (
    <div className="space-y-8">
      <Collapsible
        open={isOpenRiskDef}
        onOpenChange={setIsOpenRiskDef}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold">
            <ChevronRight className={`h-5 w-5 transition-transform ${isOpenRiskDef ? 'rotate-90' : ''}`} />
            Assessment Context
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-5">
          <div className="mt-4 bg-slate-50 p-6 rounded-md border border-slate-200">
            <div className="space-y-4">
              <OrganizationInfo 
                organization={formState.organization} 
                onOrganizationChange={(value) => updateForm({ organization: value })} 
              />
              
              <div className="ml-6 border-l-2 border-slate-300 pl-6 space-y-4">
                <AssessableItemInfo 
                  assessableItem={formState.assessableItem}
                  onAssessableItemChange={(value) => updateForm({ assessableItem: value })}
                />
                
                <div className="ml-6 border-l-2 border-slate-300 pl-6">
                  <RiskInfo 
                    risk={formState.risk}
                    riskHierarchy={formState.riskHierarchy}
                    riskIdDisplay={formState.riskIdDisplay}
                    onRiskChange={(value) => updateForm({ risk: value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={isOpenGuidance}
        onOpenChange={setIsOpenGuidance}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold">
            <ChevronRight className={`h-5 w-5 transition-transform ${isOpenGuidance ? 'rotate-90' : ''}`} />
            Assessment Guidance
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4">
          <AssessmentGuidance 
            scope={formState.scope}
            instructions={formState.instructions}
            onScopeChange={(value) => updateForm({ scope: value })}
            onInstructionsChange={(value) => updateForm({ instructions: value })}
          />
        </CollapsibleContent>
      </Collapsible>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Inherent Rating</Button>
      </div>
    </div>
  );
};

export default MainFormSection;
