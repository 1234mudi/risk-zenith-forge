
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@/contexts/FormContext";

const MainFormSection = ({ onNext }: { onNext: () => void }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { updateForm, formState } = useForm();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium text-slate-800 mb-4">Risk Definition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessableItem">Assessable Item</Label>
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
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="risk">Risk</Label>
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
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h2 className="text-xl font-medium text-slate-800 mb-4">Treatment Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="riskTreatment">Risk Treatment</Label>
            <Select 
              onValueChange={(value) => updateForm({ riskTreatment: value })}
              defaultValue={formState.riskTreatment || ""}
            >
              <SelectTrigger id="riskTreatment">
                <SelectValue placeholder="Select treatment approach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accept">Accept</SelectItem>
                <SelectItem value="mitigate">Mitigate</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="avoid">Avoid</SelectItem>
                <SelectItem value="share">Share</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="treatmentOwner">Risk Treatment Owner</Label>
            <Select 
              onValueChange={(value) => updateForm({ treatmentOwner: value })}
              defaultValue={formState.treatmentOwner || ""}
            >
              <SelectTrigger id="treatmentOwner">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john_doe">John Doe (Finance)</SelectItem>
                <SelectItem value="jane_smith">Jane Smith (Operations)</SelectItem>
                <SelectItem value="mike_johnson">Mike Johnson (IT)</SelectItem>
                <SelectItem value="sarah_williams">Sarah Williams (Compliance)</SelectItem>
                <SelectItem value="david_brown">David Brown (Risk Management)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="treatmentMethodology">Treatment Methodology/Strategy</Label>
            <Select 
              onValueChange={(value) => updateForm({ treatmentMethodology: value })}
              defaultValue={formState.treatmentMethodology || ""}
            >
              <SelectTrigger id="treatmentMethodology">
                <SelectValue placeholder="Select methodology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prevention">Prevention Controls</SelectItem>
                <SelectItem value="detection">Detection Controls</SelectItem>
                <SelectItem value="correction">Corrective Actions</SelectItem>
                <SelectItem value="insurance">Insurance/Risk Transfer</SelectItem>
                <SelectItem value="contingency">Contingency Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessmentDate">Assessment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      updateForm({ assessmentDate: format(newDate, "yyyy-MM-dd") });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
