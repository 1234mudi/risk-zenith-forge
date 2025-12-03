import React, { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Check, AtSign, X } from "lucide-react";
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
  const { getCommentsForCell, addComment, resolveComment } = useCellComments();
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const comments = getCommentsForCell(cellKey);
  const hasComments = comments.length > 0;

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
      content: newComment,
      author: CURRENT_USER,
      taggedUsers,
    });

    setNewComment("");
  };

  const handleResolve = (commentId: string) => {
    resolveComment(commentId);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          {children}
          {hasComments && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white shadow-sm" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
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
          <div className="max-h-48 overflow-y-auto divide-y">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onResolve={handleResolve} />
            ))}
          </div>
        )}

        {/* New comment input */}
        <div className="p-3 border-t bg-muted/20">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Add a comment... Use @ to tag"
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

const CommentItem = ({ comment, onResolve }: { comment: CellComment; onResolve: (id: string) => void }) => {
  // Highlight mentions in content
  const renderContent = (content: string) => {
    const parts = content.split(/(@\w+(?:\s\w+)?)/g);
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

  return (
    <div className="p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-2">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarFallback className="text-[10px] bg-primary/10">
            {comment.author.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{comment.author.name}</span>
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
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 flex-shrink-0 hover:bg-green-50 hover:text-green-600"
          onClick={() => onResolve(comment.id)}
          title="Resolve"
        >
          <Check className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CellCommentPopover;
