
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "@/contexts/FormContext";
import { ChevronDown, Info, HelpCircle } from "lucide-react";

// Additional information for context items
const contextDetails = {
  organization: {
    description: "The organizational unit being assessed in this risk review.",
    owner: "John Smith",
    createdDate: "2025-01-15",
    lastReviewed: "2025-03-20",
    additionalInfo: "This organization is part of the Finance division and handles treasury operations.",
  },
  assessableItem: {
    description: "The specific business item or process that is being evaluated for risk.",
    owner: "Jane Wilson",
    createdDate: "2025-02-05",
    lastReviewed: "2025-03-25",
    additionalInfo: "This assessable item covers the customer onboarding process for new corporate clients.",
  },
  risk: {
    description: "The category of risk being assessed in this evaluation.",
    owner: "Michael Davis",
    createdDate: "2025-01-10",
    lastReviewed: "2025-04-01",
    additionalInfo: "This risk focuses on compliance with regulatory requirements for customer due diligence.",
  }
};

const MainFormSection = ({ onNext }: { onNext: () => void }) => {
  const { updateForm, formState } = useForm();
  const [openCollapsible, setOpenCollapsible] = useState<Record<string, boolean>>({
    organization: false,
    assessableItem: false,
    risk: false
  });

  const handleSelectOrganization = (value) => {
    updateForm({ organization: value });
  };

  const handleSelectAssessableItem = (value) => {
    updateForm({ assessableItem: value });
  };

  const handleSelectRisk = (value) => {
    updateForm({ risk: value });
  };

  const toggleCollapsible = (name: string) => {
    setOpenCollapsible({
      ...openCollapsible,
      [name]: !openCollapsible[name]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-medium text-slate-800">Assessment Context</h2>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
            Key information about the assessment target
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          This section outlines the basic information about what is being assessed and the context of the risk assessment.
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-medium">Organization</Label>
              <div className="text-slate-600 text-sm bg-white px-2 py-1 rounded border">
                {formState.organization ? (
                  formState.organization === "finance" ? "Finance Department" :
                  formState.organization === "it" ? "IT Department" :
                  formState.organization === "operations" ? "Operations" :
                  formState.organization === "hr" ? "Human Resources" :
                  formState.organization === "sales" ? "Sales & Marketing" :
                  formState.organization
                ) : "Finance Department"}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Collapsible open={openCollapsible.organization} onOpenChange={(open) => setOpenCollapsible({...openCollapsible, organization: open})}>
                <CollapsibleTrigger className="flex items-center text-blue-600 text-sm hover:underline">
                  <ChevronDown className="h-4 w-4 mr-1" /> Edit
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <Select 
                    onValueChange={handleSelectOrganization}
                    defaultValue={formState.organization || "finance"}
                  >
                    <SelectTrigger id="organization">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">Finance Department</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="sales">Sales & Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </CollapsibleContent>
              </Collapsible>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 h-6 text-blue-600">
                    <HelpCircle className="h-3 w-3" /> Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Organization Details</DialogTitle>
                    <DialogDescription>
                      Information about the organization being assessed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Description</h4>
                      <p className="text-sm text-slate-600">{contextDetails.organization.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Owner</h4>
                        <p className="text-sm text-slate-600">{contextDetails.organization.owner}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Created Date</h4>
                        <p className="text-sm text-slate-600">{contextDetails.organization.createdDate}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Last Reviewed</h4>
                        <p className="text-sm text-slate-600">{contextDetails.organization.lastReviewed}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Additional Information</h4>
                      <p className="text-sm text-slate-600">{contextDetails.organization.additionalInfo}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-medium">Assessable Item</Label>
              <div className="text-slate-600 text-sm bg-white px-2 py-1 rounded border">
                {formState.assessableItem ? (
                  formState.assessableItem === "process" ? "Business Process" :
                  formState.assessableItem === "system" ? "IT System" :
                  formState.assessableItem === "project" ? "Project" :
                  formState.assessableItem === "asset" ? "Physical Asset" :
                  formState.assessableItem === "compliance" ? "Compliance Area" :
                  formState.assessableItem
                ) : "Business Process"}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Collapsible open={openCollapsible.assessableItem} onOpenChange={(open) => setOpenCollapsible({...openCollapsible, assessableItem: open})}>
                <CollapsibleTrigger className="flex items-center text-blue-600 text-sm hover:underline">
                  <ChevronDown className="h-4 w-4 mr-1" /> Edit
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <Select 
                    onValueChange={handleSelectAssessableItem}
                    defaultValue={formState.assessableItem || "process"}
                  >
                    <SelectTrigger id="assessableItem">
                      <SelectValue placeholder="Select assessable item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process">Business Process</SelectItem>
                      <SelectItem value="system">IT System</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="asset">Physical Asset</SelectItem>
                      <SelectItem value="compliance">Compliance Area</SelectItem>
                    </SelectContent>
                  </Select>
                </CollapsibleContent>
              </Collapsible>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 h-6 text-blue-600">
                    <HelpCircle className="h-3 w-3" /> Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assessable Item Details</DialogTitle>
                    <DialogDescription>
                      Information about the item being assessed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Description</h4>
                      <p className="text-sm text-slate-600">{contextDetails.assessableItem.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Owner</h4>
                        <p className="text-sm text-slate-600">{contextDetails.assessableItem.owner}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Created Date</h4>
                        <p className="text-sm text-slate-600">{contextDetails.assessableItem.createdDate}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Last Reviewed</h4>
                        <p className="text-sm text-slate-600">{contextDetails.assessableItem.lastReviewed}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Additional Information</h4>
                      <p className="text-sm text-slate-600">{contextDetails.assessableItem.additionalInfo}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-medium">Risk Type</Label>
              <div className="text-slate-600 text-sm bg-white px-2 py-1 rounded border">
                {formState.risk ? (
                  formState.risk === "operational" ? "Operational Risk" :
                  formState.risk === "financial" ? "Financial Risk" :
                  formState.risk === "strategic" ? "Strategic Risk" :
                  formState.risk === "compliance" ? "Compliance Risk" :
                  formState.risk === "reputational" ? "Reputational Risk" :
                  formState.risk === "cyber" ? "Cybersecurity Risk" :
                  formState.risk
                ) : "Compliance Risk"}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Collapsible open={openCollapsible.risk} onOpenChange={(open) => setOpenCollapsible({...openCollapsible, risk: open})}>
                <CollapsibleTrigger className="flex items-center text-blue-600 text-sm hover:underline">
                  <ChevronDown className="h-4 w-4 mr-1" /> Edit
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <Select 
                    onValueChange={handleSelectRisk}
                    defaultValue={formState.risk || "compliance"}
                  >
                    <SelectTrigger id="risk">
                      <SelectValue placeholder="Select risk type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational Risk</SelectItem>
                      <SelectItem value="financial">Financial Risk</SelectItem>
                      <SelectItem value="strategic">Strategic Risk</SelectItem>
                      <SelectItem value="compliance">Compliance Risk</SelectItem>
                      <SelectItem value="reputational">Reputational Risk</SelectItem>
                      <SelectItem value="cyber">Cybersecurity Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </CollapsibleContent>
              </Collapsible>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 h-6 text-blue-600">
                    <HelpCircle className="h-3 w-3" /> Details
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Risk Type Details</DialogTitle>
                    <DialogDescription>
                      Information about the type of risk being assessed
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Description</h4>
                      <p className="text-sm text-slate-600">{contextDetails.risk.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Owner</h4>
                        <p className="text-sm text-slate-600">{contextDetails.risk.owner}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Created Date</h4>
                        <p className="text-sm text-slate-600">{contextDetails.risk.createdDate}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-700">Last Reviewed</h4>
                        <p className="text-sm text-slate-600">{contextDetails.risk.lastReviewed}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-700">Additional Information</h4>
                      <p className="text-sm text-slate-600">{contextDetails.risk.additionalInfo}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-medium text-slate-800">Assessment Guidance</h2>
          <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
            Information for the assessor
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          This section provides guidance to the risk assessor on how to complete this assessment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="scope" className="flex items-center gap-1">
              Scope of Assessment <Info className="h-4 w-4 text-slate-400" />
            </Label>
            <Textarea 
              id="scope" 
              placeholder="Enter the scope of this risk assessment..." 
              className="min-h-[120px]"
              onChange={(e) => updateForm({ scope: e.target.value })}
              value={formState.scope || ""}
            />
            <p className="text-sm text-slate-500">Define the boundaries and coverage of this assessment.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions" className="flex items-center gap-1">
              Instructions <Info className="h-4 w-4 text-slate-400" />
            </Label>
            <Textarea 
              id="instructions" 
              placeholder="Enter instructions for completing this assessment..." 
              className="min-h-[120px]"
              onChange={(e) => updateForm({ instructions: e.target.value })}
              value={formState.instructions || ""}
            />
            <p className="text-sm text-slate-500">Provide guidance on how to conduct this assessment.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Inherent Rating</Button>
      </div>
    </div>
  );
};

export default MainFormSection;
