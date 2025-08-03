"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Bell, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePendingCounts } from "@/contexts/PendingCountsContext";
import { api } from "@/lib/api";

interface TabItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export default function BottomTabs() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { pendingReviewCount, pendingCheckinCount } = usePendingCounts();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;
      
      const { count } = await api.notifications.getUnreadCount();
      setUnreadNotifications(count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, []);
  
  // Listen for notification updates
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();
    
    window.addEventListener('notification-update', fetchUnreadCount);
    
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => {
      window.removeEventListener('notification-update', fetchUnreadCount);
      clearInterval(interval);
    };
  }, [fetchUnreadCount]);
  
  // Hide tabs on auth pages or when not logged in
  const authPages = ['/login', '/register', '/forgot-password'];
  if (!user || authPages.includes(pathname)) {
    return null;
  }
  
  const totalPendingCount = pendingReviewCount + pendingCheckinCount;

  const tabs: TabItem[] = [
    {
      href: "/find-buddy",
      icon: <Users size={24} />,
      label: "找搭子"
    },
    {
      href: "/notifications",
      icon: <Bell size={24} />,
      label: "消息"
    },
    {
      href: "/profile",
      icon: <User size={24} />,
      label: "我的"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="grid grid-cols-3 h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 relative ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
              {tab.href === "/find-buddy" && totalPendingCount > 0 && (
                <span className="absolute top-0 right-6 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-semibold">
                  {totalPendingCount}
                </span>
              )}
              {tab.href === "/notifications" && unreadNotifications > 0 && (
                <span className="absolute top-0 right-6 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-semibold">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}