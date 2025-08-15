"use client";

import { useState, useEffect } from "react";
import { User, Users, CalendarIcon, BarChart3, LogOut } from "lucide-react";
import SectionHeader from "@/components/profile/SectionHeader";
import UserInfoCard from "@/components/profile/UserInfoCard";
import CollapsibleList from "@/components/profile/CollapsibleList";
import EventCard from "@/components/profile/EventCard";
import CancelModal from "@/components/event/CancelModal";
import EditEventModal from "@/components/event/EditEventModal";
import UserStats from "@/components/profile/UserStats";
import { api } from "@/lib/api";

export default function MyProfileModal({
  open,
  onClose,
  userInfo,
  createdEvents,
  joinedEvents,
  onCancelEvent,
  onUserUpdate,
  embedMode = false,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  embedMode?: boolean;
  userInfo: {
    id: string;
    username: string;
    idealBuddy?: string;
    whyJoin?: string;
    interests?: string[];
  };
  onCancelEvent?: (eventId: string) => void;
  onUserUpdate?: (updatedUser: any) => void;
  onLogout?: () => void;
  
  createdEvents: {
    id: string;
    title: string;
    location: string;
    startTime: string;
    durationMinutes: number;
    maxParticipants: number;
    expired: boolean;
    participants: {
      user: {
        id: string;
      };
      status: string;
      cancelCount?: number;
    }[];
  }[];
  
  joinedEvents: {
    id: string;
    title: string;
    location: string;
    startTime: string;
    durationMinutes: number;
    maxParticipants: number;
    expired: boolean;
    participants: {
      user: {
        id: string;
      };
      status: string;
      cancelCount?: number;
    }[];
  }[];
}) {
  const [collapsed, setCollapsed] = useState({
    createdUpcoming: false,
    createdPast: false,
    joinedUpcoming: false,
    joinedPast: false,
  });
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  // Fetch user statistics when modal opens
  useEffect(() => {
    if (open && userInfo?.id) {
      api.user.getStats(userInfo.id)
        .then(stats => setUserStats(stats))
        .catch(err => console.error('Failed to fetch user stats:', err));
    }
  }, [open, userInfo?.id]);

  if (!open) return null;

  const handleUserUpdate = (updatedUser: any) => {
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  // ✅ 统一 enrich 所有活动
  const enrichEvents = (events: any[], userId: string) => {
    if (!events || !Array.isArray(events)) return [];
    
    return events.map((e) => {
      const approvedCount = e.participants.filter((p: any) => p.status === "approved").length;
      const currentUser = e.participants.find((p: any) =>
        (typeof p.user === "object" ? p.user.id : p.user.toString()) === userId
      );

      return {
        ...e,
        spotsLeft: e.maxParticipants - approvedCount,
        userStatus: currentUser?.status || null,
        userCancelCount: currentUser?.cancelCount || 0,
      };
    });
  };

  const enrichedCreated = enrichEvents(createdEvents, userInfo?.id);
  const enrichedJoined = enrichEvents(joinedEvents, userInfo?.id);

  const upcomingCreated = enrichedCreated.filter((e) => !e.expired)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const pastCreated = enrichedCreated.filter((e) => e.expired)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  
  // Include all non-expired events in upcoming (including pending/rejected)
  const upcomingJoined = enrichedJoined.filter((e) => !e.expired)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const pastJoined = enrichedJoined.filter((e) => e.expired)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const toggle = (key: keyof typeof collapsed) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const profileContent = (
    <div className={embedMode ? "min-h-screen bg-gray-50 pb-20" : "space-y-6"}>
      {/* Header for embed mode */}
      {embedMode && (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-center text-gray-900">我的</h1>
        </div>
      )}
      
      <div className={embedMode ? "px-4 py-4 space-y-6" : ""}>
        {!embedMode && (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
        )}

        {/* 👤 用户信息 */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <SectionHeader icon={<User className="text-indigo-500" size={16} />} title="我的个人资料" />
          <UserInfoCard 
            user={userInfo} 
            onUpdate={handleUserUpdate}
          />
        </div>

        {/* 📊 活动统计 */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <SectionHeader icon={<BarChart3 className="text-purple-500" size={16} />} title="活动统计" />
          {userStats && <UserStats stats={userStats} />}
        </div>

        {/* 📆 我发起的活动 */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <SectionHeader icon={<CalendarIcon className="text-yellow-500" size={16} />} title="我发起的活动" />

          <CollapsibleList
            title="即将到来"
            collapsed={collapsed.createdUpcoming}
            onToggle={() => toggle("createdUpcoming")}
          >
            {upcomingCreated.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                userStatus={e.userStatus}
                onEdit={() => {
                  setSelectedEvent(e);
                  setShowEditModal(true);
                }}
              />
            ))}
          </CollapsibleList>

          <CollapsibleList
            title="已结束"
            collapsed={collapsed.createdPast}
            onToggle={() => toggle("createdPast")}
          >
            {pastCreated.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                userStatus={e.userStatus}
              />
            ))}
          </CollapsibleList>
        </div>

        {/* 👥 我参与的活动 */}
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
          <SectionHeader icon={<Users className="text-green-500" size={16} />} title="我参与的活动" />

          <CollapsibleList
            title="即将到来"
            collapsed={collapsed.joinedUpcoming}
            onToggle={() => toggle("joinedUpcoming")}
          >
            {upcomingJoined.map((e) => (
              <EventCard 
                key={e.id} 
                event={e} 
                userStatus={e.userStatus}
                onCancel={() => {
                  setSelectedEvent(e);
                  setShowCancelModal(true);
                }}
              />
            ))}
          </CollapsibleList>

          <CollapsibleList
            title="已结束"
            collapsed={collapsed.joinedPast}
            onToggle={() => toggle("joinedPast")}
          >
            {pastJoined.map((e) => (
              <EventCard key={e.id} event={e} userStatus={e.userStatus} />
            ))}
          </CollapsibleList>
        </div>
        
        {/* Logout button for embed mode */}
        {embedMode && onLogout && (
          <div className="mt-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span className="text-[13px] font-medium">退出登录</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // For embed mode, render content directly
  if (embedMode) {
    return (
      <>
        {profileContent}
      
      {/* Cancel Modal */}
      {selectedEvent && (
        <CancelModal
          open={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedEvent(null);
          }}
          onConfirm={() => {
            if (onCancelEvent && selectedEvent) {
              onCancelEvent(selectedEvent.id);
              setShowCancelModal(false);
              setSelectedEvent(null);
            }
          }}
          title={selectedEvent.title}
        />
      )}

      {/* Edit Modal */}
      {selectedEvent && (
        <EditEventModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onEventUpdated={() => {
            setShowEditModal(false);
            setSelectedEvent(null);
            // Trigger refresh to update the events list
            window.dispatchEvent(new Event('refresh-events'));
          }}
        />
      )}
      </>
    );
  }

  // For modal mode, wrap in modal container
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full max-w-md h-full bg-white p-4 overflow-y-auto relative shadow-xl">
        {profileContent}
        
        {/* Cancel Modal */}
        {selectedEvent && (
          <CancelModal
            open={showCancelModal}
            onClose={() => {
              setShowCancelModal(false);
              setSelectedEvent(null);
            }}
            onConfirm={() => {
              if (onCancelEvent && selectedEvent) {
                onCancelEvent(selectedEvent.id);
                setShowCancelModal(false);
                setSelectedEvent(null);
              }
            }}
            title={selectedEvent.title}
          />
        )}

        {/* Edit Modal */}
        {selectedEvent && (
          <EditEventModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            onEventUpdated={() => {
              setShowEditModal(false);
              setSelectedEvent(null);
              // Trigger refresh to update the events list
              window.dispatchEvent(new Event('refresh-events'));
            }}
          />
        )}
      </div>
    </div>
  );
}
