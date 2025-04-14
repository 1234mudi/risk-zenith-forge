
import { Badge } from "@/components/ui/badge";
import { useForm } from "@/contexts/FormContext";

const FormHeader = () => {
  const { formState } = useForm();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-800">
          <span>Assess Risk: </span>
          <span className="text-purple-700 italic">
            {formState.risk || 'Incomplete or inadequate assessment of key individuals or entities involved in a potential Direct Transaction'}
          </span>
          <span className="ml-2 font-mono text-slate-500 text-sm">
            {formState.eraId || 'ERA-7752'}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default FormHeader;
