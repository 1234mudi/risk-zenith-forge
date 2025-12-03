import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, AtSign, CheckCircle, Clock, ExternalLink, Check } from "lucide-react";
import { useCellComments, CellComment, CellNotification } from "@/contexts/CellCommentsContext";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  inherent: "Inherent Risk",
  control: "Control Effectiveness",
  residual: "Residual Rating",
};

const CommentActivityPanel = () => {
  const { comments, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, resolveComment } = useCellComments();

  const activeComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Activity</span>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[420px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Activity & Comments
            </span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                Mark all read
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="notifications" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b px-4 h-10 bg-transparent flex-shrink-0">
            <TabsTrigger value="notifications" className="relative gap-1.5 data-[state=active]:bg-transparent">
              <AtSign className="h-3.5 w-3.5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-1.5 data-[state=active]:bg-transparent">
              <MessageSquare className="h-3.5 w-3.5" />
              Comments
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {activeComments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-1.5 data-[state=active]:bg-transparent">
              <CheckCircle className="h-3.5 w-3.5" />
              Resolved
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {resolvedComments.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="notifications" className="m-0 h-full">
              <NotificationsList 
                notifications={notifications} 
                onMarkRead={markNotificationRead}
                onResolve={resolveComment}
                comments={comments}
              />
            </TabsContent>

            <TabsContent value="comments" className="m-0 h-full">
              <CommentsList comments={activeComments} onResolve={resolveComment} />
            </TabsContent>

            <TabsContent value="resolved" className="m-0 h-full">
              <CommentsList comments={resolvedComments} resolved />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

const NotificationsList = ({ 
  notifications, 
  onMarkRead,
  onResolve,
  comments
}: { 
  notifications: CellNotification[]; 
  onMarkRead: (id: string) => void;
  onResolve: (commentId: string) => void;
  comments: CellComment[];
}) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bell className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No notifications</p>
      </div>
    );
  }

  const getRelatedComment = (notification: CellNotification) => {
    return comments.find(c => c.id === notification.commentId && !c.resolved);
  };

  return (
    <div className="divide-y">
      {notifications.map(notification => {
        const relatedComment = getRelatedComment(notification);
        return (
          <div
            key={notification.id}
            className={cn(
              "p-3 hover:bg-muted/50 transition-colors",
              !notification.read && "bg-blue-50/50"
            )}
            onClick={() => onMarkRead(notification.id)}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-1.5 rounded-full flex-shrink-0",
                notification.type === 'tag' && "bg-blue-100",
                notification.type === 'reply' && "bg-green-100",
                notification.type === 'resolve' && "bg-amber-100",
              )}>
                {notification.type === 'tag' && <AtSign className="h-3.5 w-3.5 text-blue-600" />}
                {notification.type === 'reply' && <MessageSquare className="h-3.5 w-3.5 text-green-600" />}
                {notification.type === 'resolve' && <CheckCircle className="h-3.5 w-3.5 text-amber-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{notification.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                  </span>
                </div>
                {relatedComment && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-7 text-xs gap-1 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve(relatedComment.id);
                      onMarkRead(notification.id);
                    }}
                  >
                    <Check className="h-3 w-3" />
                    Resolve
                  </Button>
                )}
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CommentsList = ({ comments, resolved = false, onResolve }: { comments: CellComment[]; resolved?: boolean; onResolve?: (id: string) => void }) => {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">{resolved ? "No resolved comments" : "No active comments"}</p>
      </div>
    );
  }

  const groupedComments = comments.reduce((acc, comment) => {
    if (!acc[comment.sectionId]) acc[comment.sectionId] = [];
    acc[comment.sectionId].push(comment);
    return acc;
  }, {} as Record<string, CellComment[]>);

  return (
    <div className="divide-y">
      {Object.entries(groupedComments).map(([sectionId, sectionComments]) => (
        <div key={sectionId}>
          <div className="px-3 py-2 bg-muted/30 sticky top-0">
            <span className="text-xs font-medium text-muted-foreground">
              {SECTION_LABELS[sectionId] || sectionId}
            </span>
          </div>
          {sectionComments.map(comment => (
            <div key={comment.id} className="p-3 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="text-[10px] bg-primary/10">
                    {comment.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(comment.createdAt, 'MMM d, h:mm a')}
                    </span>
                    {resolved && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mt-1 text-foreground/90 break-words">
                    {comment.content}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span>{comment.field}</span>
                    </div>
                    {!resolved && onResolve && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs gap-1 hover:bg-green-50 hover:text-green-600"
                        onClick={() => onResolve(comment.id)}
                      >
                        <Check className="h-3 w-3" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CommentActivityPanel;
