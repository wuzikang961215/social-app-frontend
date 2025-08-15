"use client";

import { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Bell, User, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingCounts } from "@/contexts/PendingCountsContext";
import { api } from "@/lib/api";

interface TabItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const BottomTabs = memo(function BottomTabs() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { pendingReviewCount, pendingCheckinCount } = usePendingCounts();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    // Only fetch if user is logged in
    if (!user) return;
    
    try {
      const { count } = await api.notifications.getUnreadCount();
      setUnreadNotifications(count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, [user]);
  
  // Listen for notification updates
  useEffect(() => {
    // Only set up polling if user is logged in
    if (!user) return;
    
    // Initial fetch
    fetchUnreadCount();
    
    window.addEventListener('notification-update', fetchUnreadCount);
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => {
      window.removeEventListener('notification-update', fetchUnreadCount);
      clearInterval(interval);
    };
  }, [fetchUnreadCount, user]);
  
  // Hide tabs on auth pages or when not logged in
  const authPages = ['/login', '/register', '/forgot-password'];
  if (!user || authPages.includes(pathname)) {
    return null;
  }
  
  const totalPendingCount = pendingReviewCount + pendingCheckinCount;
  
  const tabs: TabItem[] = [
    {
      href: "/find-buddy",
      icon: <Users size={20} />,
      label: "找搭子"
    },
    {
      href: "/tree-hole",
      icon: <MessageSquare size={20} />,
      label: "树洞"
    },
    {
      href: "/notifications",
      icon: <Bell size={20} />,
      label: "消息"
    },
    {
      href: "/profile",
      icon: <User size={20} />,
      label: "我的"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="grid grid-cols-4 h-12">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 relative ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {tab.href === "/find-buddy" && totalPendingCount > 0 && (
                <span className="absolute top-0 right-6 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-semibold">
                  {totalPendingCount}
                </span>
              )}
              {tab.href === "/notifications" && unreadNotifications > 0 && (
                <span className="absolute top-0 right-6 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-semibold">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomTabs;