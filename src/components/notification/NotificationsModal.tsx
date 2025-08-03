"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, CheckCheck, Trash2, Calendar, MapPin, Bell } from "lucide-react";
import { 
  getNotifications, 
  markNotificationsAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  sender?: {
    username: string;
  };
  eventId?: {
    title: string;
    location: string;
    startTime: string;
  };
  metadata?: {
    eventTitle?: string;
    eventTime?: string;
    eventLocation?: string;
    userName?: string;
  };
}

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onUpdate?: () => void;
  embedMode?: boolean;
}

export default function NotificationsModal({
  open,
  onClose,
  userId,
  onUpdate,
  embedMode = false,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const fetchingRef = useRef(false);

  const fetchNotifications = async (reset = false) => {
    if (fetchingRef.current || (!reset && !hasMore)) return;
    fetchingRef.current = true;
    setLoading(true);
    
    try {
      const currentPage = reset ? 0 : page;
      const res = await getNotifications({ 
        limit: 20, 
        skip: currentPage * 20 
      });
      
      if (reset) {
        setNotifications(res.data);
        setPage(1);
      } else {
        setNotifications(prev => [...prev, ...res.data]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(res.data.length === 20);
      
      // Mark unread notifications as read
      const unreadIds = res.data
        .filter((n: Notification) => !n.read)
        .map((n: Notification) => n.id);
        
      if (unreadIds.length > 0) {
        await markNotificationsAsRead(unreadIds);
        onUpdate?.();
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error("加载通知失败");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (open) {
      // Reset state when opening
      setNotifications([]);
      setPage(0);
      setHasMore(true);
      setLoading(false);
      // Then fetch fresh data
      fetchNotifications(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onUpdate?.();
      // Trigger notification count update
      window.dispatchEvent(new Event('notification-update'));
      toast.success("已全部标记为已读");
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const handleDeleteAll = async () => {
    try {
      // Delete all notifications one by one
      await Promise.all(notifications.map(n => deleteNotification(n.id)));
      setNotifications([]);
      // Trigger notification count update
      window.dispatchEvent(new Event('notification-update'));
      toast.success("已删除所有通知");
    } catch (error) {
      toast.error("删除失败");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("已删除");
      // Trigger notification count update
      window.dispatchEvent(new Event('notification-update'));
    } catch (error) {
      console.error("Delete notification error:", error);
      toast.error("删除失败");
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "event_approved":
        return { icon: "✅", bgColor: "bg-gray-50", iconBg: "bg-green-100" };
      case "event_denied":
        return { icon: "❌", bgColor: "bg-gray-50", iconBg: "bg-red-100" };
      case "event_join_request":
        return { icon: "🙋", bgColor: "bg-gray-50", iconBg: "bg-blue-100" };
      case "event_cancelled":
        return { icon: "⚠️", bgColor: "bg-gray-50", iconBg: "bg-yellow-100" };
      case "event_checkin":
        return { icon: "✨", bgColor: "bg-gray-50", iconBg: "bg-purple-100" };
      default:
        return { icon: "💬", bgColor: "bg-gray-50", iconBg: "bg-gray-100" };
    }
  };

  if (!open) return null;

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const style = getNotificationStyle(notification.type);
    
    return (
      <div
        className={`group rounded-lg border-2 ${
          !notification.read 
            ? "border-indigo-300 bg-indigo-50 shadow-sm" 
            : "border-gray-100 bg-white"
        } overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 ${style.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className="text-lg">{style.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className={`font-medium text-sm ${!notification.read ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        新
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: zhCN
                    })}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notification.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // For embed mode, render without modal wrapper
  if (embedMode) {
    return (
      <div className="bg-white min-h-screen">
        {/* Bulk Actions */}
        {notifications.length > 0 && (
          <div className="sticky top-12 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-10">
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <CheckCheck size={16} />
              全部标记已读
            </button>
            <button
              onClick={handleDeleteAll}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
            >
              <Trash2 size={16} />
              删除全部
            </button>
          </div>
        )}
        
        {/* Notifications List */}
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">暂无新通知</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
          
          {/* Load More */}
          {hasMore && notifications.length > 0 && (
            <div className="py-6 text-center">
              <button
                onClick={() => fetchNotifications()}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "加载中..." : "加载更多"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original modal mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl max-h-[85vh] overflow-hidden z-10">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">通知中心</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Bulk Actions */}
          {notifications.length > 0 && (
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 flex justify-between items-center">
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <CheckCheck size={16} />
                全部标记已读
              </button>
              <button
                onClick={handleDeleteAll}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
              >
                <Trash2 size={16} />
                删除全部
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">暂无新通知</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </div>

          {/* Load More */}
          {hasMore && notifications.length > 0 && (
            <div className="py-4 text-center border-t border-gray-100">
              <button
                onClick={() => fetchNotifications()}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "加载中..." : "加载更多"}
              </button>
            </div>
          )}
        </div>
      </div>
  );
}