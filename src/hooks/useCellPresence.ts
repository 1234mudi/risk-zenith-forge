import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface CellPresence {
  odedUserId: string;
  userId: string;
  userName: string;
  userInitials: string;
  cellKey: string;
  color: string;
  timestamp: number;
}

interface PresenceState {
  [key: string]: CellPresence[];
}

// Generate a consistent color based on user ID
const getUserColor = (userId: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-rose-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Generate a simple user ID for demo purposes
const generateUserId = (): string => {
  const stored = localStorage.getItem('collab_user_id');
  if (stored) return stored;
  
  const newId = `user_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('collab_user_id', newId);
  return newId;
};

// Get or generate user name
const getUserName = (): string => {
  const stored = localStorage.getItem('collab_user_name');
  if (stored) return stored;
  
  const names = ['Sarah', 'Michael', 'Emma', 'James', 'Lisa', 'David', 'Anna', 'Chris'];
  const lastNames = ['J', 'C', 'R', 'W', 'M', 'K', 'L', 'T'];
  const name = `${names[Math.floor(Math.random() * names.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  localStorage.setItem('collab_user_name', name);
  return name;
};

export const useCellPresence = (gridId: string) => {
  const [presenceByCell, setPresenceByCell] = useState<Map<string, CellPresence[]>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<CellPresence[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentCellRef = useRef<string | null>(null);
  
  const userId = generateUserId();
  const userName = getUserName();
  const userColor = getUserColor(userId);
  const userInitials = getInitials(userName);

  useEffect(() => {
    const channel = supabase.channel(`grid-presence-${gridId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<CellPresence>();
        const cellMap = new Map<string, CellPresence[]>();
        const users: CellPresence[] = [];
        
        Object.entries(state).forEach(([key, presences]) => {
          presences.forEach((presence: any) => {
            if (presence.cellKey && presence.odedUserId !== userId) {
              const existing = cellMap.get(presence.cellKey) || [];
              cellMap.set(presence.cellKey, [...existing, presence]);
            }
            if (!users.find(u => u.odedUserId === presence.odedUserId)) {
              users.push(presence);
            }
          });
        });
        
        setPresenceByCell(cellMap);
        setActiveUsers(users.filter(u => u.odedUserId !== userId));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          // Track initial presence without a specific cell
          await channel.track({
            odedUserId: userId,
            userName,
            userInitials,
            cellKey: null,
            color: userColor,
            timestamp: Date.now(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [gridId, userId, userName, userInitials, userColor]);

  const trackCellFocus = useCallback(async (cellKey: string | null) => {
    if (!channelRef.current) return;
    
    currentCellRef.current = cellKey;
    
    await channelRef.current.track({
      odedUserId: userId,
      userName,
      userInitials,
      cellKey,
      color: userColor,
      timestamp: Date.now(),
    });
  }, [userId, userName, userInitials, userColor]);

  const getCellPresence = useCallback((cellKey: string): CellPresence[] => {
    return presenceByCell.get(cellKey) || [];
  }, [presenceByCell]);

  return {
    trackCellFocus,
    getCellPresence,
    isConnected,
    activeUsers,
    currentUserId: userId,
    currentUserName: userName,
    currentUserInitials: userInitials,
    currentUserColor: userColor,
  };
};
