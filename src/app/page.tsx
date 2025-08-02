"use client";

import React, { useEffect, useState, useRef } from "react";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/event/ConfirmModal";
import EventDetailModal from "@/components/event/EventDetailModal";
import CancelModal from "@/components/event/CancelModal";
import ReviewAndCheckinModal from "@/components/event/ReviewAndCheckinModal";
import MyProfileModal from "@/components/profile/MyProfileModal";
import EventCard from "@/components/event/EventCard";
import EditEventModal from "@/components/event/EditEventModal";
import NotificationBell from "@/components/notification/NotificationBell";
import NotificationsModal from "@/components/notification/NotificationsModal";
import DisclaimerModal from "@/components/DisclaimerModal";

import { useEvents } from "@/hooks/useEvents";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useModals } from "@/hooks/useModals";
import { api } from "@/lib/api";

export interface Event {
  id: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  time: string;
  location: string;
  category: string;
  description: string;
  tags: string[];
  spotsLeft: number;
  maxParticipants: number;
  expired: boolean;
  countdown: number;
  organizer: {
    name: string;
    avatar: string;
    id: string;
  };
  creator?: {
    id: string;
    username: string;
  };
  participants: {
    user: {
      id: string;
      username: string;
    };
    status:
      | "pending"
      | "approved"
      | "denied"
      | "checkedIn"
      | "noShow"
      | "cancelled"
      | "requestingCancellation";
  }[];
  userStatus?: string | null;
  userCancelCount?: number;
  isOrganizer: boolean;
}

interface UserInfo {
  id: string;
  username: string;
  idealBuddy?: string;
  interests?: string[];
  whyJoin?: string;
}

export default function HomePage() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("首页");
  const [showLaunchMenu, setShowLaunchMenu] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // Use custom hooks
  const { 
    userInfo, 
    createdEvents, 
    joinedEvents, 
    pendingReviewCount, 
    pendingCheckinCount,
    loading: userLoading,
    logout,
    checkPendingReviews,
    refreshJoinedEvents 
  } = useUserInfo();
  
  const { 
    events, 
    loading: eventsLoading, 
    fetchEvents, 
    joinEvent: joinEventAction, 
    cancelEvent: cancelEventAction 
  } = useEvents({ userId: userInfo?.id });
  
  const {
    showModal,
    showDetail,
    showCancelModal,
    showEditModal,
    showReviewModal,
    showProfileModal,
    showNotificationsModal,
    setShowModal,
    setShowDetail,
    setShowCancelModal,
    setShowEditModal,
    setShowReviewModal,
    setShowProfileModal,
    setShowNotificationsModal,
  } = useModals();

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLaunchMenu(false);
      }
    };

    if (showLaunchMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLaunchMenu]);

  const uniqueCategories = Array.from(new Set(events.map((e) => e.category)));
  const categories = ["首页", ...uniqueCategories];

  const canCreateEvent = true;
  const isScoreLoaded = true;

  const filteredEvents =
    selectedCategory === "首页"
      ? events.filter((e) => !e.expired)
      : events.filter((e) => e.category === selectedCategory && !e.expired);

  const handleLaunchClick = () => {
    setShowLaunchMenu((prev) => !prev);
  };

  const handleConfirm = async () => {
    if (!selectedEvent) return;
    try {
      const data = await joinEventAction(selectedEvent.id);
      toast.success(data.message || "报名成功！");
      setShowModal(false);
      setShowDetail(false);
      // Refresh joined events to update profile
      await refreshJoinedEvents();
    } catch {
      toast.error("报名失败，请稍后再试");
    }
  };
  
  const handleCancel = async () => {
    if (!selectedEvent) return;
    try {
      const data = await cancelEventAction(selectedEvent.id);
      toast.success(data.message || "取消成功");
      setShowCancelModal(false);
      setShowDetail(false);
      // Refresh joined events to update profile
      await refreshJoinedEvents();
    } catch {
      toast.error("取消失败，请稍后再试");
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* 分类导航 */}
      <div className="flex gap-4 mb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 发起活动菜单 */}
      {isScoreLoaded && (
        <div className="relative inline-block mt-4" ref={menuRef}>
          <button
            onClick={handleLaunchClick}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition relative ${
              canCreateEvent
                ? "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                : "text-gray-400 bg-gray-200"
            }`}
          >
            <span className="text-lg">🎉</span> 找人一起
            {(pendingReviewCount > 0 || pendingCheckinCount > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                {pendingReviewCount + pendingCheckinCount}
              </span>
            )}
          </button>

          {showLaunchMenu && canCreateEvent && (
            <div className="absolute z-50 mt-2 left-0 bg-white rounded-lg shadow-lg border w-40">
              <button
                onClick={() => {
                  window.location.href = "events/create";
                  setShowLaunchMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                发个邀约 🎯
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(true);
                  setShowLaunchMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative flex items-center justify-between"
              >
                <span>看看谁来了 👀</span>
                <div className="flex items-center gap-1">
                  {pendingReviewCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {pendingReviewCount}
                    </span>
                  )}
                  {pendingCheckinCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                      {pendingCheckinCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header with notifications and logout */}
      <div className="flex justify-between items-center mb-6">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {userInfo && (
            <NotificationBell 
              onClick={() => setShowNotificationsModal(true)} 
            />
          )}
          <LogOut
            onClick={logout}
            className="w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer"
          />
        </div>
      </div>

      {/* 我的按钮 */}
      <button
        onClick={() => setShowProfileModal(true)}
        disabled={!userInfo || userLoading}
        className={`absolute top-20 right-4 flex gap-1 px-3 py-1.5 text-sm rounded-full transition ${
          !userInfo || userLoading 
            ? "text-gray-400 bg-gray-100 cursor-not-allowed" 
            : "text-gray-700 bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <span className="text-base">👤</span> 我的
      </button>

      {/* 活动卡片 */}
      <div className="space-y-4">
        {eventsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无活动
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <EventCard
              key={event.id || `event-${index}`}
              event={event}
              onClick={() => {
                setSelectedEvent(event);
                setShowDetail(true);
              }}
              onJoinClick={() => {
                setSelectedEvent(event);
                setShowModal(true); // 报名弹窗
              }}
              onCancelClick={() => {
                setSelectedEvent(event);
                setShowCancelModal(true); // 取消报名弹窗
              }}
              onEditClick={() => {
                setSelectedEvent(event);
                setShowEditModal(true); // 编辑活动弹窗
              }}
            />      
          ))
        )}
      </div>

      {/* 弹窗区域 */}
      {selectedEvent && (
        <>
          <ConfirmModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
            title={selectedEvent.title}
            spotsLeft={selectedEvent.spotsLeft}
          />
          <CancelModal
            open={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancel}
            title={selectedEvent.title}
          />
          <EditEventModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            event={selectedEvent}
            onEventUpdated={() => {
              setShowEditModal(false);
              fetchEvents();
              toast.success("活动更新成功");
            }}
          />
          <EventDetailModal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            event={{ ...selectedEvent, userStatus: selectedEvent.userStatus ?? undefined }}
            onJoinClick={() => {
              setSelectedEvent(selectedEvent);
              setShowModal(true);
            }}
            onCancelClick={() => {
              setSelectedEvent(selectedEvent);
              setShowCancelModal(true);
            }}
            onEditClick={() => {
              setShowDetail(false);
              setShowEditModal(true);
            }}
          />
        </>
      )}

      <ReviewAndCheckinModal 
        open={showReviewModal} 
        onClose={() => {
          setShowReviewModal(false);
          fetchEvents(); // Refresh events after closing modal
          // Refresh pending count
          checkPendingReviews();
        }}
        onUpdate={() => {
          fetchEvents();
          // Update pending count immediately
          checkPendingReviews();
        }}
      />
      {userInfo && (
        <MyProfileModal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userInfo={userInfo}
          createdEvents={createdEvents}
          joinedEvents={joinedEvents}
          onCancelEvent={async (eventId) => {
            try {
              const data = await cancelEventAction(eventId);
              toast.success(data.message || "取消成功");
              // Refresh joined events to update profile
              await refreshJoinedEvents();
            } catch {
              toast.error("取消失败，请稍后再试");
            }
          }}
          onUserUpdate={(updatedUser) => {
            // Update userInfo state to reflect changes immediately
            // This will re-render the modal with updated data
            window.dispatchEvent(new Event('user-update'));
          }}
        />
      )}
      <NotificationsModal
        open={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onUpdate={() => {
          // Force refresh the notification bell count
          window.dispatchEvent(new Event('notification-update'));
        }}
      />
      
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
      
      {/* 免责声明链接 - Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 text-center">
        <button
          onClick={() => setShowDisclaimerModal(true)}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          免责声明 | Disclaimer
        </button>
      </div>
    </div>
  );
}