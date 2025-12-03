import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CellComment {
  id: string;
  cellKey: string; // format: "sectionId-rowId-field"
  sectionId: string;
  rowId: string;
  field: string;
  content: string;
  author: { id: string; name: string; avatar?: string };
  taggedUsers: { id: string; name: string }[];
  createdAt: Date;
  resolved?: boolean;
}

export interface CellNotification {
  id: string;
  type: 'tag' | 'reply' | 'resolve';
  commentId: string;
  cellKey: string;
  message: string;
  fromUser: { id: string; name: string };
  toUserId: string;
  read: boolean;
  createdAt: Date;
}

interface CellCommentsContextType {
  comments: CellComment[];
  notifications: CellNotification[];
  addComment: (comment: Omit<CellComment, 'id' | 'createdAt'>) => void;
  resolveComment: (commentId: string) => void;
  getCommentsForCell: (cellKey: string) => CellComment[];
  getCellsWithComments: (sectionId: string) => string[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

const CellCommentsContext = createContext<CellCommentsContextType | undefined>(undefined);

// Sample collaborators for tagging
export const AVAILABLE_USERS = [
  { id: "1", name: "Sarah Johnson", avatar: "SJ" },
  { id: "2", name: "Michael Chen", avatar: "MC" },
  { id: "3", name: "Emma Rodriguez", avatar: "ER" },
  { id: "4", name: "David Kim", avatar: "DK" },
  { id: "5", name: "Lisa Wong", avatar: "LW" },
];

const CURRENT_USER = { id: "current", name: "You", avatar: "YO" };

// Sample initial comments
const initialComments: CellComment[] = [
  {
    id: "c1",
    cellKey: "inherent-impact-1-value",
    sectionId: "inherent",
    rowId: "impact-1",
    field: "value",
    content: "Please review this rating - seems high based on recent data @Sarah Johnson",
    author: { id: "2", name: "Michael Chen" },
    taggedUsers: [{ id: "1", name: "Sarah Johnson" }],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "c2",
    cellKey: "control-ctrl-1-effectiveness",
    sectionId: "control",
    rowId: "ctrl-1",
    field: "effectiveness",
    content: "Control effectiveness needs verification @Emma Rodriguez",
    author: { id: "1", name: "Sarah Johnson" },
    taggedUsers: [{ id: "3", name: "Emma Rodriguez" }],
    createdAt: new Date(Date.now() - 43200000),
  },
];

const initialNotifications: CellNotification[] = [
  {
    id: "n1",
    type: "tag",
    commentId: "c1",
    cellKey: "inherent-impact-1-value",
    message: "Michael Chen tagged you in a comment on Impact rating",
    fromUser: { id: "2", name: "Michael Chen" },
    toUserId: "current",
    read: false,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "n2",
    type: "tag",
    commentId: "c2",
    cellKey: "control-ctrl-1-effectiveness",
    message: "Sarah Johnson tagged you in a comment on Control Effectiveness",
    fromUser: { id: "1", name: "Sarah Johnson" },
    toUserId: "current",
    read: false,
    createdAt: new Date(Date.now() - 43200000),
  },
];

export const CellCommentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<CellComment[]>(initialComments);
  const [notifications, setNotifications] = useState<CellNotification[]>(initialNotifications);

  const addComment = (comment: Omit<CellComment, 'id' | 'createdAt'>) => {
    const newComment: CellComment = {
      ...comment,
      id: `c${Date.now()}`,
      createdAt: new Date(),
    };
    setComments(prev => [...prev, newComment]);

    // Generate notifications for tagged users
    comment.taggedUsers.forEach(user => {
      const newNotification: CellNotification = {
        id: `n${Date.now()}-${user.id}`,
        type: 'tag',
        commentId: newComment.id,
        cellKey: comment.cellKey,
        message: `${comment.author.name} tagged you in a comment`,
        fromUser: comment.author,
        toUserId: user.id,
        read: false,
        createdAt: new Date(),
      };
      setNotifications(prev => [...prev, newNotification]);
    });
  };

  const resolveComment = (commentId: string) => {
    setComments(prev => 
      prev.map(c => c.id === commentId ? { ...c, resolved: true } : c)
    );
  };

  const getCommentsForCell = (cellKey: string) => {
    return comments.filter(c => c.cellKey === cellKey && !c.resolved);
  };

  const getCellsWithComments = (sectionId: string) => {
    return [...new Set(comments.filter(c => c.sectionId === sectionId && !c.resolved).map(c => c.cellKey))];
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <CellCommentsContext.Provider value={{
      comments,
      notifications,
      addComment,
      resolveComment,
      getCommentsForCell,
      getCellsWithComments,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
    }}>
      {children}
    </CellCommentsContext.Provider>
  );
};

export const useCellComments = () => {
  const context = useContext(CellCommentsContext);
  if (!context) {
    throw new Error("useCellComments must be used within CellCommentsProvider");
  }
  return context;
};

export { CURRENT_USER };
