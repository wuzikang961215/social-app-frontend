"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MyProfileModal from "@/components/profile/MyProfileModal";
import { api } from "@/lib/api";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout: authLogout, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [eventsData, setEventsData] = useState({
    createdEvents: [],
    joinedEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUserInfo(user);
      fetchUserEvents(user.id);
    }
  }, [user]);

  const fetchUserEvents = async (userId: string) => {
    try {
      const [createdRes, joinedRes] = await Promise.all([
        api.events.getCreated(),
        api.events.getJoined()
      ]);
      
      setEventsData({
        createdEvents: createdRes,
        joinedEvents: joinedRes
      });
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    toast.success("退出成功");
    authLogout();
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      await api.events.leave(eventId);
      toast.success("取消成功");
      // Refresh events to update the UI
      if (user) {
        fetchUserEvents(user.id);
      }
    } catch (error) {
      toast.error("取消失败，请稍后再试");
    }
  };

  if (!userInfo || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MyProfileModal
        open={true}
        onClose={() => {}} // We don't close since it's a page
        userInfo={userInfo}
        createdEvents={eventsData.createdEvents}
        joinedEvents={eventsData.joinedEvents}
        embedMode={true} // Add this prop to hide modal chrome
        onLogout={handleLogout}
        onCancelEvent={handleCancelEvent}
      />
    </div>
  );
}