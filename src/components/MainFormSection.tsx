
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@/contexts/FormContext";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, InfoIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import RiskAppetiteIndicator from "./RiskAppetiteIndicator";

const MainFormSection = ({ onNext }: { onNext: () => void }) => {
  const { formState, updateForm } = useForm();
  const [isOpenRiskDef, setIsOpenRiskDef] = useState(true);
  const [isOpenGuidance, setIsOpenGuidance] = useState(true);
  const [isOpenAppetite, setIsOpenAppetite] = useState(true);
  
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
              <div className="flex flex-col space-y-2">
                <Label htmlFor="organization" className="text-slate-700 font-semibold">Organization</Label>
                <div className="relative">
                  <Input
                    id="organization"
                    value={formState.organization}
                    onChange={(e) => updateForm({ organization: e.target.value })}
                    className="text-center font-medium bg-white"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <InfoIcon className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Organization Details</DialogTitle>
                          <DialogDescription>
                            Additional information about this organization.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <h4 className="font-semibold text-sm">ID</h4>
                            <p className="text-sm text-slate-600">ORG-7890</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Description</h4>
                            <p className="text-sm text-slate-600">
                              A multinational banking corporation offering a wide range of financial services.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Industry</h4>
                            <p className="text-sm text-slate-600">Banking & Financial Services</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">Risk Profile</h4>
                            <p className="text-sm text-slate-600">Medium-High</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              
              <div className="ml-6 border-l-2 border-slate-300 pl-6 space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="assessableItem" className="text-slate-700 font-semibold">Assessable Item</Label>
                  <div className="relative">
                    <Input
                      id="assessableItem"
                      value={formState.assessableItem}
                      onChange={(e) => updateForm({ assessableItem: e.target.value })}
                      className="text-center font-medium bg-white"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <InfoIcon className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assessable Item Details</DialogTitle>
                            <DialogDescription>
                              Additional information about this assessable item.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <h4 className="font-semibold text-sm">ID</h4>
                              <p className="text-sm text-slate-600">ITEM-4567</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Description</h4>
                              <p className="text-sm text-slate-600">
                                Process to verify and validate customer identity and assess associated risks.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Owner</h4>
                              <p className="text-sm text-slate-600">Compliance Department</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Regulatory References</h4>
                              <p className="text-sm text-slate-600">FATF Recommendations, AML Directive</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 border-l-2 border-slate-300 pl-6 flex flex-col space-y-2">
                  <Label htmlFor="risk" className="text-slate-700 font-semibold">Risk</Label>
                  <div className="relative">
                    <Input
                      id="risk"
                      value={formState.risk}
                      onChange={(e) => updateForm({ risk: e.target.value })}
                      className="text-center font-medium bg-white"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <InfoIcon className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Risk Details</DialogTitle>
                            <DialogDescription>
                              Additional information about this risk.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <h4 className="font-semibold text-sm">ID</h4>
                              <p className="text-sm text-slate-600">{formState.riskIdDisplay}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Description</h4>
                              <p className="text-sm text-slate-600">
                                Risk of incomplete or inadequate assessment of key individuals or entities involved in a potential Direct Transaction.
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Risk Category</h4>
                              <p className="text-sm text-slate-600">Compliance Risk</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Risk Hierarchy</h4>
                              <p className="text-sm text-slate-600">{formState.riskHierarchy}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    <Badge variant="outline" className="bg-slate-100 text-slate-600 font-normal">
                      {formState.riskHierarchy}
                    </Badge>
                  </div>
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
          <div className="grid grid-cols-1 gap-6 mt-4">
            <div>
              <Label htmlFor="scope" className="text-slate-700">Scope</Label>
              <Textarea
                id="scope"
                value={formState.scope}
                onChange={(e) => updateForm({ scope: e.target.value })}
                className="mt-1 min-h-[100px]"
                placeholder="Define the scope of this risk assessment..."
              />
            </div>
            
            <div>
              <Label htmlFor="instructions" className="text-slate-700">Instructions</Label>
              <Textarea
                id="instructions"
                value={formState.instructions}
                onChange={(e) => updateForm({ instructions: e.target.value })}
                className="mt-1 min-h-[100px]"
                placeholder="Provide detailed instructions for assessors..."
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={isOpenAppetite}
        onOpenChange={setIsOpenAppetite}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between">
          <CollapsibleTrigger className="flex items-center gap-2 text-base font-semibold">
            <ChevronRight className={`h-5 w-5 transition-transform ${isOpenAppetite ? 'rotate-90' : ''}`} />
            Risk Appetite
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="space-y-4">
          <RiskAppetiteIndicator className="mt-4" />
        </CollapsibleContent>
      </Collapsible>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Inherent Rating</Button>
      </div>
    </div>
  );
};

export default MainFormSection;
