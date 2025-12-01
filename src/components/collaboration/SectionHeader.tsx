import React from "react";
import { CollaborationIndicator } from "./CollaborationIndicator";
import { useCollaboration } from "@/contexts/CollaborationContext";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        {children}
      </div>
      {sectionCollab && (
        <CollaborationIndicator
          collaborators={sectionCollab.collaborators}
          activeEditors={sectionCollab.activeEditors}
        />
      )}
    </div>
  );
};
