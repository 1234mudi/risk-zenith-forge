import React from 'react';
import { CellPresence } from '@/hooks/useCellPresence';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CellPresenceBadgeProps {
  presences: CellPresence[];
}

export const CellPresenceBadge: React.FC<CellPresenceBadgeProps> = ({ presences }) => {
  if (presences.length === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 flex -space-x-1 z-20">
      <TooltipProvider>
        {presences.slice(0, 3).map((presence) => (
          <Tooltip key={presence.odedUserId}>
            <TooltipTrigger asChild>
              <div
                className={`${presence.color} w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm border-2 border-white animate-pulse cursor-default`}
              >
                {presence.userInitials}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>{presence.userName} is editing</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {presences.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-slate-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm border-2 border-white">
                +{presences.length - 3}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p>{presences.length - 3} more editing</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

interface CollaborationBannerProps {
  isConnected: boolean;
  activeUsers: CellPresence[];
}

export const CollaborationBanner: React.FC<CollaborationBannerProps> = ({ 
  isConnected, 
  activeUsers 
}) => {
  if (!isConnected || activeUsers.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md px-3 py-2 flex items-center gap-3 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-1">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
      </div>
      <span className="text-sm text-blue-700">
        <span className="font-medium">Live collaboration active!</span>
        <span className="text-blue-600 ml-1">
          Watch for colored badges on cells showing who's editing in real time.
        </span>
      </span>
      <div className="flex -space-x-2 ml-auto">
        {activeUsers.slice(0, 5).map((user) => (
          <div
            key={user.odedUserId}
            className={`${user.color} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm border-2 border-white`}
            title={user.userName}
          >
            {user.userInitials}
          </div>
        ))}
        {activeUsers.length > 5 && (
          <div className="bg-slate-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm border-2 border-white">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};
