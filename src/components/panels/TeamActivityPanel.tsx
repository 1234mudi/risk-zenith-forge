import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { Eye, Edit, Clock, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TeamActivityPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamActivityPanel: React.FC<TeamActivityPanelProps> = ({ open, onOpenChange }) => {
  const { collaborationState } = useCollaboration();
  const [activeTab, setActiveTab] = useState("by-section");

  const sections = [
    "main", "inherent", "control", "residual", "heatmap", 
    "treatment", "issues", "metrics", "comments"
  ];

  const activities = [
    { user: "Sarah Johnson", action: "edited Inherent Rating", time: new Date(Date.now() - 5 * 60000), section: "inherent" },
    { user: "Michael Chen", action: "viewed Control Effectiveness", time: new Date(Date.now() - 15 * 60000), section: "control" },
    { user: "Emma Rodriguez", action: "added comment to Residual Rating", time: new Date(Date.now() - 30 * 60000), section: "residual" },
    { user: "Sarah Johnson", action: "updated Risk Treatment", time: new Date(Date.now() - 45 * 60000), section: "treatment" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getSectionLabel = (sectionId: string) => {
    const labels: Record<string, string> = {
      main: "Main Form",
      inherent: "Inherent Rating",
      control: "Control Effectiveness",
      residual: "Residual Rating",
      heatmap: "Heat Map",
      treatment: "Treatment",
      issues: "Issues",
      metrics: "Metrics & Losses",
      comments: "Comments"
    };
    return labels[sectionId] || sectionId;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Team Activity</SheetTitle>
        </SheetHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="by-section">By Section</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="form-map">Form Map</TabsTrigger>
          </TabsList>

          <TabsContent value="by-section" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 pr-4">
                {sections.map((sectionId) => {
                  const sectionData = collaborationState[sectionId as keyof typeof collaborationState];
                  const collaborators = sectionData?.collaborators || [];
                  const activeEditors = sectionData?.activeEditors || [];
                  const viewers = collaborators.filter(c => !activeEditors.includes(c.id));

                  return (
                    <div 
                      key={sectionId} 
                      className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm">{getSectionLabel(sectionId)}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {collaborators.length} {collaborators.length === 1 ? 'user' : 'users'}
                        </Badge>
                      </div>

                      {activeEditors.length > 0 && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Edit className="h-3 w-3" />
                            <span>Editing</span>
                          </div>
                          <div className="space-y-2">
                            {collaborators
                              .filter(c => activeEditors.includes(c.id))
                              .map((collab) => (
                                <div key={collab.id} className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6 border-2 border-green-500">
                                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                      {getInitials(collab.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs font-medium">{collab.name}</span>
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {collab.role}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {viewers.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Eye className="h-3 w-3" />
                            <span>Viewing</span>
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {viewers.map((collab) => (
                              <Avatar key={collab.id} className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials(collab.name)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                      )}

                      {collaborators.length === 0 && (
                        <p className="text-xs text-muted-foreground">No active users</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3 pr-4">
                {activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className="border-l-2 border-primary/20 pl-4 pb-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="text-xs">
                          {getInitials(activity.user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{activity.user}</span>
                          <span className="text-xs text-muted-foreground">
                            {activity.action}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.time, { addSuffix: true })}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs mt-2">
                          {getSectionLabel(activity.section)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="form-map" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2 pr-4">
                {sections.map((sectionId) => {
                  const sectionData = collaborationState[sectionId as keyof typeof collaborationState];
                  const hasActivity = (sectionData?.collaborators?.length || 0) > 0;
                  
                  return (
                    <button
                      key={sectionId}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        hasActivity 
                          ? 'border-primary/50 bg-primary/5 hover:bg-primary/10' 
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={`h-4 w-4 ${hasActivity ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium">
                            {getSectionLabel(sectionId)}
                          </span>
                        </div>
                        {hasActivity && (
                          <div className="flex -space-x-2">
                            {(sectionData?.collaborators || []).slice(0, 3).map((collab) => (
                              <Avatar key={collab.id} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {getInitials(collab.name)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default TeamActivityPanel;
