
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "@/contexts/FormContext";

type Issue = {
  id: string;
  issueKey: string;
  title: string;
  description: string;
  dueDate: Date | undefined;
  owner: string;
};

const DEFAULT_ISSUES: Issue[] = [
  {
    id: "1",
    issueKey: "ISS-001",
    title: "",
    description: "",
    dueDate: undefined,
    owner: "",
  }
];

const IssuesSection = ({ onNext }: { onNext: () => void }) => {
  const [issues, setIssues] = useState<Issue[]>(DEFAULT_ISSUES);
  const { updateForm } = useForm();

  const handleAddIssue = () => {
    const newId = (issues.length + 1).toString();
    const newIssueKey = `ISS-${String(issues.length + 1).padStart(3, '0')}`;
    setIssues([
      ...issues,
      {
        id: newId,
        issueKey: newIssueKey,
        title: "",
        description: "",
        dueDate: undefined,
        owner: "",
      }
    ]);
  };

  const handleRemoveIssue = (id: string) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const handleIssueChange = (id: string, field: keyof Issue, value: any) => {
    const updatedIssues = issues.map(issue => 
      issue.id === id ? { ...issue, [field]: value } : issue
    );
    setIssues(updatedIssues);
    updateForm({ issues: updatedIssues });
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-md">
        <h2 className="text-xl font-medium text-amber-800 mb-2">Issues</h2>
        <p className="text-amber-700 text-sm">Record any issues or observations related to the risk being assessed.</p>
      </div>
      
      <div className="space-y-6">
        {issues.map((issue) => (
          <div key={issue.id} className="border rounded-md p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-800">Issue #{issue.id}</h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveIssue(issue.id)}
                className="text-red-500 h-8"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <Label htmlFor={`issue-key-${issue.id}`}>Issue Key</Label>
                <Input
                  id={`issue-key-${issue.id}`}
                  value={issue.issueKey}
                  onChange={(e) => handleIssueChange(issue.id, "issueKey", e.target.value)}
                  className="mt-1"
                  placeholder="Unique identifier for this issue"
                />
              </div>
              
              <div>
                <Label htmlFor={`issue-title-${issue.id}`}>Title</Label>
                <Input
                  id={`issue-title-${issue.id}`}
                  value={issue.title}
                  onChange={(e) => handleIssueChange(issue.id, "title", e.target.value)}
                  className="mt-1"
                  placeholder="Issue title"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor={`issue-description-${issue.id}`}>Description</Label>
              <Textarea
                id={`issue-description-${issue.id}`}
                value={issue.description}
                onChange={(e) => handleIssueChange(issue.id, "description", e.target.value)}
                className="mt-1 min-h-[100px]"
                placeholder="Detailed description of the issue"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor={`issue-due-date-${issue.id}`}>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id={`issue-due-date-${issue.id}`}
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !issue.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {issue.dueDate ? format(issue.dueDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={issue.dueDate}
                      onSelect={(date) => handleIssueChange(issue.id, "dueDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor={`issue-owner-${issue.id}`}>Issue Owner</Label>
                <Select
                  value={issue.owner}
                  onValueChange={(value) => handleIssueChange(issue.id, "owner", value)}
                >
                  <SelectTrigger id={`issue-owner-${issue.id}`} className="mt-1">
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
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddIssue}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Issue
        </Button>
        
        <Button onClick={onNext}>Continue to Comments & Attachments</Button>
      </div>
    </div>
  );
};

export default IssuesSection;
