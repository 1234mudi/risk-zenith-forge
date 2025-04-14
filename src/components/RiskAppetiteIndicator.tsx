
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from "@/contexts/FormContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

type RiskAppetiteIndicatorProps = {
  className?: string;
};

const RiskAppetiteIndicator = ({ className = "" }: RiskAppetiteIndicatorProps) => {
  const { formState, addAppetiteBreachIssue } = useForm();
  const { toast } = useToast();
  
  const { riskAppetite, residualRatingScore, isWithinAppetite } = formState;
  
  const createBreachIssue = () => {
    const newIssue = {
      id: (formState.issues.length + 1).toString(),
      issueKey: `ISS-APP-${String(formState.issues.length + 1).padStart(3, '0')}`,
      title: "Risk Appetite Breach",
      description: `The current residual risk rating (${residualRatingScore}) exceeds the defined risk appetite threshold (${riskAppetite.threshold}). A remediation plan is required to bring the risk within appetite.`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      owner: formState.treatmentOwner,
    };
    
    addAppetiteBreachIssue(newIssue);
    
    toast({
      title: "Risk Appetite Issue Created",
      description: "A new issue has been created to address the risk appetite breach.",
    });
  };
  
  return (
    <div className={`flex flex-col p-3 border rounded-md ${className}`} style={{ backgroundColor: `${riskAppetite.color}10` }}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-1">
            Risk Appetite
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Risk appetite defines the amount and type of risk the organization is willing to accept in pursuit of its objectives.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <Badge 
            className="mt-1" 
            style={{ backgroundColor: riskAppetite.color, color: 'white' }}
          >
            {riskAppetite.level}
          </Badge>
          <p className="text-xs mt-1 text-gray-600 max-w-xs">{riskAppetite.description}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500">Threshold:</span>
            <Badge variant="outline" className="font-mono">{riskAppetite.threshold}</Badge>
          </div>
          
          <div className="flex gap-2 items-center mt-1">
            <span className="text-xs text-gray-500">Current:</span>
            <Badge 
              variant="outline" 
              className={`font-mono ${!isWithinAppetite ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}
            >
              {residualRatingScore}
            </Badge>
          </div>
          
          <div className="mt-2">
            {isWithinAppetite ? (
              <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Within Appetite</span>
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Outside Appetite</span>
              </Badge>
            )}
          </div>
          
          {!isWithinAppetite && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="mt-2" 
              onClick={createBreachIssue}
            >
              Create Issue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAppetiteIndicator;
