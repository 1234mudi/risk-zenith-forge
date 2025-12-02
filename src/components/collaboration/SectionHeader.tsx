import React from "react";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Users, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionHeaderProps {
  title: string;
  sectionId: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  sectionId,
  icon,
  className,
  children,
}) => {
  const { collaborationState } = useCollaboration();
  const sectionCollab = collaborationState[sectionId as keyof typeof collaborationState];

  const hasCollaborators = sectionCollab && sectionCollab.collaborators.length > 0;
  const activeCount = sectionCollab?.activeEditors.length || 0;
  const viewerCount = sectionCollab ? sectionCollab.collaborators.length - activeCount : 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        {children}
        
        {hasCollaborators && (
          <div className="flex items-center gap-2 animate-fade-in">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="secondary" 
                    className="h-6 px-2 gap-1.5 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <Users className="h-3 w-3" />
                    <span className="text-xs font-medium">Shared</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">This section is shared with collaborators</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex -space-x-2">
              {sectionCollab.collaborators.slice(0, 3).map((collab, idx) => {
                const isActive = sectionCollab.activeEditors.includes(collab.id);
                return (
                  <TooltipProvider key={collab.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative animate-scale-in" style={{ animationDelay: `${idx * 50}ms` }}>
                          <Avatar 
                            className={cn(
                              "h-7 w-7 border-2 border-white ring-2 transition-all duration-200",
                              isActive 
                                ? "ring-green-500 shadow-lg shadow-green-500/20" 
                                : "ring-blue-300"
                            )}
                          >
                            <AvatarFallback className={cn(
                              "text-xs font-semibold",
                              isActive 
                                ? "bg-green-100 text-green-700" 
                                : "bg-blue-100 text-blue-700"
                            )}>
                              {getInitials(collab.name)}
                            </AvatarFallback>
                          </Avatar>
                          {isActive && (
                            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-semibold">{collab.name}</p>
                          <p className="text-muted-foreground">{collab.role}</p>
                          {isActive && (
                            <p className="text-green-600 mt-1 flex items-center gap-1">
                              <span className="inline-block h-1.5 w-1.5 bg-green-500 rounded-full" />
                              Editing now
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
              {sectionCollab.collaborators.length > 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-7 w-7 rounded-full bg-muted border-2 border-white ring-2 ring-blue-300 flex items-center justify-center">
                        <span className="text-xs font-semibold text-muted-foreground">
                          +{sectionCollab.collaborators.length - 3}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{sectionCollab.collaborators.length - 3} more collaborators</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {activeCount > 0 && (
              <Badge 
                variant="outline" 
                className="h-6 px-2 gap-1 bg-green-50 text-green-700 border-green-300 animate-pulse"
              >
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                <span className="text-xs font-medium">{activeCount} editing</span>
              </Badge>
            )}

            {viewerCount > 0 && (
              <Badge 
                variant="outline" 
                className="h-6 px-2 gap-1 bg-slate-50 text-slate-600 border-slate-300"
              >
                <Eye className="h-3 w-3" />
                <span className="text-xs font-medium">{viewerCount} viewing</span>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
