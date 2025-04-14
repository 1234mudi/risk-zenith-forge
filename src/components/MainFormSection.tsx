
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useForm } from "@/contexts/FormContext";
import { ChevronDown, Info } from "lucide-react";

const MainFormSection = ({ onNext }: { onNext: () => void }) => {
  const { updateForm, formState } = useForm();

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
                {formState.organization ? formState.organization : "Not selected"}
              </div>
            </div>
            
            <Collapsible>
              <CollapsibleTrigger className="flex items-center text-blue-600 text-sm hover:underline">
                <ChevronDown className="h-4 w-4 mr-1" /> View details
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Select 
                  onValueChange={(value) => updateForm({ organization: value })}
                  defaultValue={formState.organization || ""}
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
                <div className="mt-2 text-sm text-slate-600">
                  <p>The organizational unit being assessed in this risk review.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-medium">Assessable Item</Label>
              <div className="text-slate-600 text-sm bg-white px-2 py-1 rounded border">
                {formState.assessableItem ? formState.assessableItem : "Not selected"}
              </div>
            </div>
            
            <Collapsible>
              <CollapsibleTrigger className="flex items-center text-blue-600 text-sm hover:underline">
                <ChevronDown className="h-4 w-4 mr-1" /> View details
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Select 
                  onValueChange={(value) => updateForm({ assessableItem: value })}
                  defaultValue={formState.assessableItem || ""}
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
                <div className="mt-2 text-sm text-slate-600">
                  <p>The specific business item or process that is being evaluated for risk.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <Label className="font-medium">Risk Type</Label>
              <div className="text-slate-600 text-sm bg-white px-2 py-1 rounded border">
                {formState.risk ? formState.risk : "Not selected"}
              </div>
            </div>
            
            <Collapsible>
              <CollapsibleTrigger className="flex items-center text-blue-600 text-sm hover:underline">
                <ChevronDown className="h-4 w-4 mr-1" /> View details
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Select 
                  onValueChange={(value) => updateForm({ risk: value })}
                  defaultValue={formState.risk || ""}
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
                <div className="mt-2 text-sm text-slate-600">
                  <p>The category of risk being assessed in this evaluation.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
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
              defaultValue={formState.scope || ""}
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
              defaultValue={formState.instructions || ""}
            />
            <p className="text-sm text-slate-500">Provide guidance on how to conduct this assessment.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Treatment</Button>
      </div>
    </div>
  );
};

export default MainFormSection;
