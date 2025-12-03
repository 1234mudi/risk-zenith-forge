import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Check, AtSign, Reply, CheckCircle2 } from "lucide-react";
import { useCellComments, AVAILABLE_USERS, CURRENT_USER, CellComment } from "@/contexts/CellCommentsContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CellCommentPopoverProps {
  cellKey: string;
  sectionId: string;
  rowId: string;
  field: string;
  children: React.ReactNode;
}

const CellCommentPopover = ({ cellKey, sectionId, rowId, field, children }: CellCommentPopoverProps) => {
  const { getCommentsForCell, addComment, resolveComment, notifications, markNotificationRead } = useCellComments();
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const comments = getCommentsForCell(cellKey);
  const hasComments = comments.length > 0;

  // Check if this cell has unread notifications for current user
  const unreadNotificationsForCell = notifications.filter(
    n => !n.read && n.cellKey === cellKey && n.toUserId === 'current'
  );
  const hasUnreadTag = unreadNotificationsForCell.length > 0;

  // Mark notifications as read when popover opens
  useEffect(() => {
    if (open && unreadNotificationsForCell.length > 0) {
      unreadNotificationsForCell.forEach(n => markNotificationRead(n.id));
    }
  }, [open, unreadNotificationsForCell, markNotificationRead]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const position = e.target.selectionStart || 0;
    setNewComment(value);
    setCursorPosition(position);

    // Check for @ mention
    const textBeforeCursor = value.slice(0, position);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      if (!textAfterAt.includes(' ')) {
        setShowMentions(true);
        setMentionFilter(textAfterAt.toLowerCase());
        return;
      }
    }
    setShowMentions(false);
  };

  const insertMention = (userName: string) => {
    const textBeforeCursor = newComment.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    const textAfterCursor = newComment.slice(cursorPosition);
    
    const newText = textBeforeCursor.slice(0, lastAtIndex) + `@${userName} ` + textAfterCursor;
    setNewComment(newText);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const filteredUsers = AVAILABLE_USERS.filter(user =>
    user.name.toLowerCase().includes(mentionFilter)
  );

  const extractTaggedUsers = (text: string) => {
    const taggedUsers: { id: string; name: string }[] = [];
    AVAILABLE_USERS.forEach(user => {
      if (text.includes(`@${user.name}`)) {
        taggedUsers.push({ id: user.id, name: user.name });
      }
    });
    return taggedUsers;
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const taggedUsers = extractTaggedUsers(newComment);
    
    addComment({
      cellKey,
      sectionId,
      rowId,
      field,
      content: replyingTo ? `[Reply] ${newComment}` : newComment,
      author: CURRENT_USER,
      taggedUsers,
    });

    setNewComment("");
    setReplyingTo(null);
  };

  const handleResolve = (commentId: string) => {
    resolveComment(commentId);
  };

  const handleReplyAndResolve = (commentId: string) => {
    if (newComment.trim()) {
      handleSubmit();
    }
    resolveComment(commentId);
  };

  const startReply = (commentId: string, authorName: string) => {
    setReplyingTo(commentId);
    setNewComment(`@${authorName} `);
    textareaRef.current?.focus();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          {children}
          {hasComments && (
            <div className={cn(
              "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm",
              hasUnreadTag ? "bg-blue-500 animate-pulse" : "bg-amber-400"
            )} />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Cell Comments
            {hasComments && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {comments.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Existing comments */}
        {hasComments && (
          <div className="max-h-64 overflow-y-auto divide-y">
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                onResolve={handleResolve}
                onReply={startReply}
                onReplyAndResolve={handleReplyAndResolve}
                isReplying={replyingTo === comment.id}
              />
            ))}
          </div>
        )}

        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-3 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <Reply className="h-3 w-3" />
              <span>Replying to comment</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-blue-600 hover:text-blue-800"
              onClick={() => {
                setReplyingTo(null);
                setNewComment("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* New comment input */}
        <div className="p-3 border-t bg-muted/20">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder={replyingTo ? "Write your reply..." : "Add a comment... Use @ to tag"}
              value={newComment}
              onChange={handleTextChange}
              className="min-h-[60px] pr-10 text-sm resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !showMentions) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-1 right-1 h-7 w-7"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>

            {/* Mention suggestions dropdown */}
            {showMentions && filteredUsers.length > 0 && (
              <div className="absolute bottom-full left-0 w-full bg-popover border rounded-md shadow-lg mb-1 z-50">
                {filteredUsers.map(user => (
                  <button
                    key={user.id}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left"
                    onClick={() => insertMention(user.name)}
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">{user.avatar}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <AtSign className="h-3 w-3" />
            <span>Type @ to tag someone</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface CommentItemProps {
  comment: CellComment;
  onResolve: (id: string) => void;
  onReply: (id: string, authorName: string) => void;
  onReplyAndResolve: (id: string) => void;
  isReplying: boolean;
}

const CommentItem = ({ comment, onResolve, onReply, onReplyAndResolve, isReplying }: CommentItemProps) => {
  // Highlight mentions in content
  const renderContent = (content: string) => {
    // Remove [Reply] prefix for display
    const displayContent = content.startsWith('[Reply] ') ? content.slice(8) : content;
    const parts = displayContent.split(/(@\w+(?:\s\w+)?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-blue-600 font-medium bg-blue-50 px-0.5 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const isReply = comment.content.startsWith('[Reply]');

  return (
    <div className={cn(
      "p-3 hover:bg-muted/30 transition-colors",
      isReplying && "bg-blue-50/50 ring-1 ring-blue-200"
    )}>
      <div className="flex items-start gap-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarFallback className="text-[10px] bg-primary/10">
            {comment.author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{comment.author.name}</span>
            {isReply && (
              <Badge variant="outline" className="text-[9px] px-1 py-0 text-blue-600 border-blue-200">
                Reply
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {format(comment.createdAt, 'MMM d, h:mm a')}
            </span>
          </div>
          <p className="text-sm mt-1 text-foreground/90 break-words">
            {renderContent(comment.content)}
          </p>
          {comment.taggedUsers.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {comment.taggedUsers.map(user => (
                <Badge key={user.id} variant="outline" className="text-[10px] px-1.5 py-0">
                  {user.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 mt-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-blue-600"
              onClick={() => onReply(comment.id, comment.author.name)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-green-600"
              onClick={() => onResolve(comment.id)}
            >
              <Check className="h-3 w-3 mr-1" />
              Resolve
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-emerald-600"
              onClick={() => onReplyAndResolve(comment.id)}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Reply & Resolve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CellCommentPopover;
