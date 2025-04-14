
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@/contexts/FormContext";

const TreatmentSection = ({ onNext }: { onNext: () => void }) => {
  const [date, setDate] = useState<Date | undefined>(
    formState.assessmentDate ? new Date(formState.assessmentDate) : new Date()
  );
  const { updateForm, formState } = useForm();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-medium text-slate-800">Risk Treatment Plan</h2>
          <div className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
            How the risk will be managed
          </div>
        </div>
        <p className="text-slate-600 text-sm mb-4">
          In this section, define how the identified risk will be treated, who owns the treatment actions, and the methodology to be used.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="riskTreatment">Risk Treatment Approach</Label>
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
            <p className="text-sm text-slate-500">The high-level strategy for handling this risk.</p>
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
            <p className="text-sm text-slate-500">The person responsible for implementing the treatment plan.</p>
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
            <p className="text-sm text-slate-500">The specific approach to implementing the treatment plan.</p>
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
            <p className="text-sm text-slate-500">The date when this assessment was conducted.</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue to Inherent Rating</Button>
      </div>
    </div>
  );
};

export default TreatmentSection;
