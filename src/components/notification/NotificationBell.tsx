"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell } from "lucide-react";
import { getUnreadCount } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface NotificationBellProps {
  onClick: () => void;
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    // Only fetch if user is logged in
    if (!user) return;
    
    try {
      // API call will use cookies automatically for authentication
      const { count } = await getUnreadCount();
      setUnreadCount(prevCount => {
        // Only trigger refresh if there are NEW notifications (not just unread ones)
        // and only if the count actually increased
        if (prevCount !== undefined && count > prevCount && count > 0) {
          // Defer the event dispatch to avoid state update during render
          setTimeout(() => {
            window.dispatchEvent(new Event('refresh-events'));
          }, 0);
        }
        return count;
      });
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, [user]);

  useEffect(() => {
    // Only set up polling if user is logged in
    if (!user) return;
    
    // Fetch initial count
    fetchUnreadCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Listen for manual refresh events
    const handleUpdate = () => fetchUnreadCount();
    window.addEventListener('notification-update', handleUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('notification-update', handleUpdate);
    };
  }, [fetchUnreadCount, user]);

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:scale-110 transition-transform duration-200"
    >
      <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}