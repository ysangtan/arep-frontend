import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Settings, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { notificationService } from '@/services/notificationMockData';
import { Notification } from '@/types/notification.types';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { NotificationPreferences } from './NotificationPreferences';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const data = await notificationService.getNotifications();
    setNotifications(data);
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  };

  const handleMarkAsRead = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationService.markAsRead(notificationId);
    await loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await loadNotifications();
  };

  const handleDelete = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationService.deleteNotification(notificationId);
    await loadNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      notificationService.markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'review-assignment':
        return '📋';
      case 'mention':
        return '@';
      case 'change-request':
        return '🔄';
      case 'due-date':
        return '⏰';
      case 'status-change':
        return '✓';
      case 'comment':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-info';
      default:
        return 'bg-muted';
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                variant="destructive"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[400px] p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} new</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowPreferences(true)}
                title="Notification settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="text-xl">{getNotificationIcon(notification.type)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          {!notification.read && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${getPriorityColor(notification.priority)}`} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => handleDelete(notification.id, e)}
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={() => {
                    navigate('/notifications');
                    setOpen(false);
                  }}
                >
                  View all notifications
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <NotificationPreferences
        open={showPreferences}
        onOpenChange={setShowPreferences}
      />
    </>
  );
}
