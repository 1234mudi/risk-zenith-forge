
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const ScopeSharingRisks = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const relatedRisks = [
    { id: "RISK-2025-041", name: "Incomplete customer information collection", level: "High" },
    { id: "RISK-2025-042", name: "Inadequate source of funds verification", level: "Medium" },
    { id: "RISK-2025-044", name: "Improper customer risk classification", level: "Low" },
  ];

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className="w-full md:max-w-xs bg-slate-50 rounded-lg border p-2"
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full flex justify-between">
          <span>Risks sharing same scope</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        <div className="space-y-2 pt-2">
          {relatedRisks.map((risk) => (
            <div key={risk.id} className="p-2 bg-white rounded-md text-sm border flex justify-between items-center">
              <div>
                <div className="font-medium">{risk.name}</div>
                <div className="text-xs text-slate-500">{risk.id}</div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ScopeSharingRisks;
