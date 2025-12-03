import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Check, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollaboration } from "@/contexts/CollaborationContext";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface CollaborationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_COLLABORATORS: Collaborator[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah.j@company.com", role: "Risk Analyst" },
  { id: "2", name: "Michael Chen", email: "m.chen@company.com", role: "Compliance Officer" },
  { id: "3", name: "Emma Rodriguez", email: "e.rodriguez@company.com", role: "Senior Auditor" },
  { id: "4", name: "David Park", email: "d.park@company.com", role: "Team Lead" },
  { id: "5", name: "Lisa Anderson", email: "l.anderson@company.com", role: "Risk Manager" },
];

const FORM_SECTIONS = [
  { id: "inherent", label: "Inherent Rating" },
  { id: "control", label: "Control Effectiveness" },
  { id: "residual", label: "Residual Rating" },
  { id: "issues", label: "Issues" },
  { id: "additional", label: "Additional Details" },
];

export const CollaborationModal: React.FC<CollaborationModalProps> = ({ open, onOpenChange }) => {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [canEditFullForm, setCanEditFullForm] = useState(true);
  const [removingCollaborator, setRemovingCollaborator] = useState<string | null>(null);
  const { toast } = useToast();
  const { 
    updateSectionCollaboration, 
    setActiveEditor, 
    collaborationState,
    removeCollaboratorFromAllSections
  } = useCollaboration();

  const handleCollaboratorToggle = (collaboratorId: string) => {
    setSelectedCollaborators((prev) =>
      prev.includes(collaboratorId)
        ? prev.filter((id) => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const handleSubmit = () => {
    if (selectedCollaborators.length === 0) {
      toast({
        title: "No collaborators selected",
        description: "Please select at least one collaborator.",
        variant: "destructive",
      });
      return;
    }

    // Get selected collaborator objects
    const selectedCollaboratorObjects = MOCK_COLLABORATORS.filter((c) =>
      selectedCollaborators.includes(c.id)
    );

    // Always apply to all sections
    const sectionsToUpdate = FORM_SECTIONS.map((s) => s.id);
    updateSectionCollaboration(sectionsToUpdate, selectedCollaboratorObjects);

    // Simulate one user actively editing (for demo purposes)
    if (selectedCollaboratorObjects.length > 0) {
      sectionsToUpdate.forEach((sectionId) => {
        setActiveEditor(sectionId, selectedCollaboratorObjects[0].id, true);
      });
    }

    toast({
      title: "Collaboration settings updated",
      description: `${selectedCollaborators.length} collaborator(s) can now edit the full assessment form.`,
    });
    onOpenChange(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleRemoveAllAccess = (userId: string) => {
    const collaborator = MOCK_COLLABORATORS.find(c => c.id === userId);
    setRemovingCollaborator(`all-${userId}`);
    setTimeout(() => {
      removeCollaboratorFromAllSections(userId);
      setRemovingCollaborator(null);
      toast({
        title: "Access removed",
        description: `${collaborator?.name} can no longer edit the form.`,
      });
    }, 300);
  };

  const getSectionsForCollaborator = (userId: string) => {
    return Object.entries(collaborationState)
      .filter(([_, section]) => section.collaborators.some(c => c.id === userId))
      .map(([sectionId]) => sectionId);
  };

  const allCollaboratorsWithAccess = MOCK_COLLABORATORS.filter(collaborator => 
    getSectionsForCollaborator(collaborator.id).length > 0
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
        <DialogHeader className="bg-gradient-to-r from-purple-50 to-blue-50 -m-6 mb-0 p-6 rounded-t-lg border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            Manage Collaborators
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 space-y-6 mt-6">
          {/* Edit Permission Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="edit-full-form" className="font-semibold cursor-pointer text-blue-900">
                Collaborators can edit the full assessment form
              </Label>
              <p className="text-xs text-blue-700">
                Selected collaborators will have access to all form sections
              </p>
            </div>
            <Switch
              id="edit-full-form"
              checked={canEditFullForm}
              onCheckedChange={setCanEditFullForm}
              className="ml-4 data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Collaborators Selection */}
          <Card className="border-2 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="border-b bg-purple-50/50">
              <CardTitle className="text-lg flex items-center justify-between">
                Select Collaborators
                <Badge className="bg-purple-600 text-white hover:bg-purple-700">{selectedCollaborators.length} selected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              {MOCK_COLLABORATORS.map((collaborator) => {
                const isSelected = selectedCollaborators.includes(collaborator.id);
                return (
                  <div
                    key={collaborator.id}
                    onClick={() => handleCollaboratorToggle(collaborator.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                      "hover:bg-purple-50 hover:border-purple-300 hover:shadow-sm",
                      isSelected && "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-md"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleCollaboratorToggle(collaborator.id)}
                      className="pointer-events-none"
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                        {getInitials(collaborator.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{collaborator.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{collaborator.email}</p>
                    </div>
                    <Badge className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                      {collaborator.role}
                    </Badge>
                    {isSelected && <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Current Access Card */}
          {allCollaboratorsWithAccess.length > 0 && (
            <Card className="border-2 bg-gradient-to-br from-white to-amber-50">
              <CardHeader className="border-b bg-amber-50/50">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500 rounded-md">
                      <UserMinus className="h-4 w-4 text-white" />
                    </div>
                    Current Access
                  </div>
                  <Badge className="bg-amber-500 text-white hover:bg-amber-600">{allCollaboratorsWithAccess.length} active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allCollaboratorsWithAccess.map((collaborator) => {
                  const isRemoving = removingCollaborator === `all-${collaborator.id}`;

                  return (
                    <div
                      key={collaborator.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300",
                        isRemoving && "opacity-0 scale-95"
                      )}
                    >
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold">
                          {getInitials(collaborator.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{collaborator.name}</p>
                        <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                      </div>

                      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Full Form Access
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-shrink-0 h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveAllAccess(collaborator.id)}
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t bg-gradient-to-r from-purple-50/30 to-blue-50/30 -mx-6 -mb-6 px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-24">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!canEditFullForm}
            className="min-w-32 gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Check className="h-4 w-4" />
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
