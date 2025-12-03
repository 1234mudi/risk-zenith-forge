import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertTriangle, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RCSAStatus } from "./ReviewActionDialog";

interface ReviewStatusBadgeProps {
  status: RCSAStatus;
  className?: string;
}

const statusConfig: Record<RCSAStatus, {
  icon: React.ElementType;
  className: string;
  label: string;
}> = {
  "Draft": {
    icon: FileEdit,
    className: "bg-slate-100 text-slate-700 border-slate-200",
    label: "Draft",
  },
  "Pending Review": {
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Pending Review",
  },
  "Approved/Finalized": {
    icon: Check,
    className: "bg-green-50 text-green-700 border-green-200",
    label: "Approved",
  },
  "Returned for Rework/Challenged": {
    icon: AlertTriangle,
    className: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Challenged",
  },
};

const ReviewStatusBadge = ({ status, className }: ReviewStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default ReviewStatusBadge;
