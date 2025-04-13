
import { Badge } from "@/components/ui/badge";
import { useForm } from "@/contexts/FormContext";

const FormHeader = () => {
  const { formState } = useForm();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-800">Enhanced Risk Assessment</h1>
        <p className="text-sm text-slate-600">Complete all sections to submit your risk assessment</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Only showing ERA ID, hiding other IDs as requested */}
        <div className="bg-slate-100 px-3 py-1.5 rounded-md text-sm">
          <span className="font-medium text-slate-500">ERA ID: </span>
          <Badge variant="outline" className="ml-1 font-mono">
            {formState.eraId || 'ERA-7752'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
