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
import { Users, Check, X, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { Separator } from "@/components/ui/separator";

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
  const [applyToAll, setApplyToAll] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [removingCollaborator, setRemovingCollaborator] = useState<string | null>(null);
  const { toast } = useToast();
  const { 
    updateSectionCollaboration, 
    setActiveEditor, 
    collaborationState,
    removeCollaboratorFromSection,
    removeCollaboratorFromAllSections
  } = useCollaboration();

  const handleCollaboratorToggle = (collaboratorId: string) => {
    setSelectedCollaborators((prev) =>
      prev.includes(collaboratorId)
        ? prev.filter((id) => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const handleSectionToggle = (sectionId: string) => {
    if (!applyToAll) {
      setSelectedSections((prev) =>
        prev.includes(sectionId)
          ? prev.filter((id) => id !== sectionId)
          : [...prev, sectionId]
      );
    }
  };

  const handleApplyToAllToggle = (checked: boolean) => {
    setApplyToAll(checked);
    if (checked) {
      setSelectedSections(FORM_SECTIONS.map((s) => s.id));
    }
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

    if (!applyToAll && selectedSections.length === 0) {
      toast({
        title: "No sections selected",
        description: "Please select at least one section or enable 'Apply to all sections'.",
        variant: "destructive",
      });
      return;
    }

    // Get selected collaborator objects
    const selectedCollaboratorObjects = MOCK_COLLABORATORS.filter((c) =>
      selectedCollaborators.includes(c.id)
    );

    // Update collaboration state
    const sectionsToUpdate = applyToAll
      ? FORM_SECTIONS.map((s) => s.id)
      : selectedSections;

    updateSectionCollaboration(sectionsToUpdate, selectedCollaboratorObjects);

    // Simulate one user actively editing (for demo purposes)
    if (selectedCollaboratorObjects.length > 0) {
      sectionsToUpdate.forEach((sectionId) => {
        setActiveEditor(sectionId, selectedCollaboratorObjects[0].id, true);
      });
    }

    toast({
      title: "Collaboration settings updated",
      description: `${selectedCollaborators.length} collaborator(s) assigned to ${
        applyToAll ? "all sections" : `${selectedSections.length} section(s)`
      }.`,
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

  const handleRemoveCollaborator = (sectionId: string, userId: string) => {
    setRemovingCollaborator(`${sectionId}-${userId}`);
    setTimeout(() => {
      removeCollaboratorFromSection(sectionId, userId);
      setRemovingCollaborator(null);
      toast({
        title: "Collaborator removed",
        description: "Access has been revoked for this section.",
      });
    }, 300);
  };

  const handleRemoveAllAccess = (userId: string) => {
    const collaborator = MOCK_COLLABORATORS.find(c => c.id === userId);
    setRemovingCollaborator(`all-${userId}`);
    setTimeout(() => {
      removeCollaboratorFromAllSections(userId);
      setRemovingCollaborator(null);
      toast({
        title: "All access removed",
        description: `${collaborator?.name} has been removed from all sections.`,
      });
    }, 300);
  };

  const getSectionsForCollaborator = (userId: string) => {
    return Object.entries(collaborationState)
      .filter(([_, section]) => section.collaborators.some(c => c.id === userId))
      .map(([sectionId]) => sectionId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
        <DialogHeader className="bg-gradient-to-r from-purple-50 to-blue-50 -m-6 mb-0 p-6 rounded-t-lg border-b">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            Manage Collaborators
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 space-y-6 mt-6">
          {/* Two-column grid for selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Collaborators */}
          <Card className="border-2 h-fit bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="border-b bg-purple-50/50">
              <CardTitle className="text-lg flex items-center justify-between">
                Select Collaborators
                <Badge className="bg-purple-600 text-white hover:bg-purple-700">{selectedCollaborators.length} selected</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
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

          {/* Right Column - Applicable Sections */}
          <Card className="border-2 h-fit bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b bg-blue-50/50">
              <CardTitle className="text-lg">Applicable Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Apply to All Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 border-dashed shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="apply-all" className="font-semibold cursor-pointer text-blue-900">
                    Apply selected collaborators to ALL sections
                  </Label>
                  <p className="text-xs text-blue-700">
                    Enable to automatically select all form sections
                  </p>
                </div>
                <Switch
                  id="apply-all"
                  checked={applyToAll}
                  onCheckedChange={handleApplyToAllToggle}
                  className="ml-4 data-[state=checked]:bg-blue-600"
                />
              </div>

              {/* Section Checkboxes */}
              <div className="space-y-2">
                {FORM_SECTIONS.map((section) => {
                  const isSelected = selectedSections.includes(section.id);
                  return (
                    <div
                      key={section.id}
                      onClick={() => handleSectionToggle(section.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                        applyToAll
                          ? "bg-blue-50 border-blue-300 cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm",
                        isSelected && !applyToAll && "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-400 shadow-md"
                      )}
                    >
                      <Checkbox
                        id={section.id}
                        checked={applyToAll || isSelected}
                        disabled={applyToAll}
                        onCheckedChange={() => handleSectionToggle(section.id)}
                        className="pointer-events-none"
                      />
                      <Label
                        htmlFor={section.id}
                        className={cn(
                          "flex-1 font-medium cursor-pointer",
                          applyToAll && "cursor-not-allowed"
                        )}
                      >
                        {section.label}
                      </Label>
                      {(applyToAll || isSelected) && (
                        <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Current Access Card - Full Width */}
          {(() => {
            const allCollaboratorsWithAccess = MOCK_COLLABORATORS.filter(collaborator => 
              getSectionsForCollaborator(collaborator.id).length > 0
            );
            
            if (allCollaboratorsWithAccess.length === 0) return null;

            return (
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
                    const collaboratorSections = getSectionsForCollaborator(collaborator.id);
                    const isRemoving = removingCollaborator === `all-${collaborator.id}`;

                    return (
                      <div
                        key={collaborator.id}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border-2 transition-all duration-300",
                          isRemoving && "opacity-0 scale-95"
                        )}
                      >
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold">
                            {getInitials(collaborator.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">{collaborator.name}</p>
                              <p className="text-xs text-muted-foreground">{collaborator.role}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-shrink-0 h-8 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemoveAllAccess(collaborator.id)}
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              Remove All
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            {collaboratorSections.map((sectionId) => {
                              const section = FORM_SECTIONS.find(s => s.id === sectionId);
                              const isSectionRemoving = removingCollaborator === `${sectionId}-${collaborator.id}`;
                              
                              return (
                                <Badge
                                  key={sectionId}
                                  className={cn(
                                    "group pl-2 pr-1 py-1 gap-1.5 cursor-pointer transition-all duration-300",
                                    "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-300",
                                    "hover:from-red-100 hover:to-pink-100 hover:text-red-800 hover:border-red-300",
                                    isSectionRemoving && "opacity-0 scale-75"
                                  )}
                                  onClick={() => handleRemoveCollaborator(sectionId, collaborator.id)}
                                >
                                  <span className="text-xs font-medium">{section?.label}</span>
                                  <X className="h-3 w-3 opacity-50 group-hover:opacity-100 group-hover:text-red-600" />
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })()}
          </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t bg-gradient-to-r from-purple-50/30 to-blue-50/30 -mx-6 -mb-6 px-6 pb-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-24">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="min-w-32 gap-2 bg-purple-600 hover:bg-purple-700">
            <Check className="h-4 w-4" />
            Apply Collaboration Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
