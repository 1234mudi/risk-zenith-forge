import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface CollaborationIndicatorProps {
  collaborators: Collaborator[];
  activeEditors: string[];
  className?: string;
}

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  collaborators,
  activeEditors,
  className,
}) => {
  if (collaborators.length === 0) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const activeCollaborators = collaborators.filter((c) =>
    activeEditors.includes(c.id)
  );
  const maxVisible = 3;
  const visibleCollaborators = collaborators.slice(0, maxVisible);
  const remainingCount = collaborators.length - maxVisible;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Collaboration Badge */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
            >
              <Users className="h-3 w-3" />
              <span className="text-xs font-medium">{collaborators.length}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-semibold mb-1">Collaborators on this section</p>
            <div className="space-y-1">
              {collaborators.map((c) => (
                <div key={c.id} className="text-xs">
                  {c.name} - {c.role}
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Avatar Stack */}
      <div className="flex -space-x-2">
        {visibleCollaborators.map((collaborator) => {
          const isActive = activeEditors.includes(collaborator.id);
          return (
            <TooltipProvider key={collaborator.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Avatar
                      className={cn(
                        "h-7 w-7 border-2 border-background transition-all",
                        isActive && "ring-2 ring-green-500 ring-offset-2"
                      )}
                    >
                      <AvatarFallback
                        className={cn(
                          "text-xs font-semibold",
                          isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {getInitials(collaborator.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white dark:border-slate-900"></span>
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="text-xs">
                    <p className="font-semibold">{collaborator.name}</p>
                    <p className="text-muted-foreground">{collaborator.role}</p>
                    {isActive && (
                      <Badge
                        variant="outline"
                        className="mt-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                      >
                        <span className="flex items-center gap-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Editing now
                        </span>
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 border-2 border-background bg-slate-100 dark:bg-slate-800">
                  <AvatarFallback className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    +{remainingCount}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">
                  {remainingCount} more collaborator
                  {remainingCount > 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Active Editing Indicator */}
      {activeCollaborators.length > 0 && (
        <Badge
          variant="outline"
          className="animate-pulse bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 px-2 py-0.5"
        >
          <span className="flex items-center gap-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {activeCollaborators.length} editing
          </span>
        </Badge>
      )}
    </div>
  );
};
