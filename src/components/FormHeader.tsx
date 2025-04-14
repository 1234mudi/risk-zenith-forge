
import React from "react";
import { useForm } from "@/contexts/FormContext";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FormHeader = () => {
  const { formState } = useForm();
  
  const isWithinAppetite = formState.isWithinAppetite;
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex-1">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>Assess Risk: {formState.risk}</span>
          <Badge variant="outline" className="ml-2 text-xs font-normal">
            {formState.eraId}
          </Badge>
        </h2>
        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
          <span className="text-gray-500">Reference:</span> {formState.referenceId}
          <span className="mx-2">•</span>
          <span className="text-gray-500">Assessment ID:</span> {formState.assessmentId}
          <span className="mx-2">•</span>
          <span className="text-gray-500">Date:</span> {formState.assessmentDate}
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-xs text-gray-500 mr-2">Risk Hierarchy:</span>
          <Badge variant="secondary" className="font-normal text-xs">
            {formState.riskHierarchy}
          </Badge>
        </div>
      </div>
      
      <div className="shrink-0">
        {!isWithinAppetite ? (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-md border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <div className="text-sm font-medium">Outside Risk Appetite</div>
              <div className="text-xs">Remediation required</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-md border border-green-200">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm font-medium">Within Risk Appetite</div>
              <div className="text-xs">No action required</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormHeader;
