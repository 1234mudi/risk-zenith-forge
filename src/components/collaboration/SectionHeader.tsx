import React from "react";
import { cn } from "@/lib/utils";
import ReviewChallengeIndicator from "@/components/review/ReviewChallengeIndicator";

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
  // Check if this section can have challenge indicator
  const canHaveChallengeIndicator = ["inherent", "control", "residual"].includes(sectionId);

  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold">{title}</h3>
        {children}
        
        {/* Challenge Indicator */}
        {canHaveChallengeIndicator && (
          <ReviewChallengeIndicator sectionId={sectionId as "inherent" | "control" | "residual"} />
        )}
      </div>
    </div>
  );
};
