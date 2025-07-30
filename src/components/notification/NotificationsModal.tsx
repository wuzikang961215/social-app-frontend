"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, CheckCheck, Trash2, Calendar, MapPin, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  onUpdate?: () => void; // Callback to update unread count
}

export default function NotificationsModal({ open, onClose, onUpdate }: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const fetchingRef = useRef(false);

  const fetchNotifications = async (reset = false) => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;
    if (!reset && (loading || !hasMore)) return;
    
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
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onUpdate?.();
      toast.success("已全部标记为已读");
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("已删除");
    } catch (error) {
      toast.error("删除失败");
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "event_approved":
        return { icon: "🎉", bgColor: "bg-emerald-50", iconBg: "bg-emerald-100" };
      case "event_denied":
        return { icon: "😔", bgColor: "bg-red-50", iconBg: "bg-red-100" };
      case "event_join_request":
        return { icon: "✋", bgColor: "bg-indigo-50", iconBg: "bg-indigo-100" };
      case "event_cancelled":
        return { icon: "🚫", bgColor: "bg-gray-50", iconBg: "bg-gray-100" };
      case "event_checkin":
        return { icon: "📍", bgColor: "bg-cyan-50", iconBg: "bg-cyan-100" };
      default:
        return { icon: "📬", bgColor: "bg-gray-50", iconBg: "bg-gray-100" };
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl max-h-[85vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur-sm border-b border-gray-100 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">通知中心</h2>
                <p className="text-xs text-gray-500">查看你的所有通知</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  全部已读
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[calc(85vh-100px)] px-4 py-2">
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">暂无新通知</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const style = getNotificationStyle(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className={`group rounded-2xl border ${
                        !notification.read 
                          ? "border-indigo-200 shadow-sm" 
                          : "border-gray-100"
                      } overflow-hidden transition-all duration-200 cursor-pointer`}
                    >
                      <div className={`p-4 ${style.bgColor}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${style.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <span className="text-xl">{style.icon}</span>
                          </div>
                      
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-0.5">
                                  {notification.message}
                                </p>
                                
                                {notification.metadata && (notification.metadata.eventTime || notification.metadata.eventLocation) && (
                                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                                    {notification.metadata.eventTime && (
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-gray-400" />
                                        {new Date(notification.metadata.eventTime).toLocaleString("zh-CN", {
                                          month: '2-digit',
                                          day: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    )}
                                    {notification.metadata.eventLocation && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        {notification.metadata.eventLocation}
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: zhCN
                                  })}
                                </p>
                              </div>
                              
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Load More */}
            {hasMore && notifications.length > 0 && (
              <div className="py-6 text-center">
                <button
                  onClick={() => fetchNotifications()}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {loading ? "加载中..." : "查看更多"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}