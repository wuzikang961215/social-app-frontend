"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/event/ConfirmModal";
import EventDetailModal from "@/components/event/EventDetailModal";
import CancelModal from "@/components/event/CancelModal";
import ReviewAndCheckinModal from "@/components/event/ReviewAndCheckinModal";
import EventCard from "@/components/event/EventCard";
import EditEventModal from "@/components/event/EditEventModal";
import DisclaimerModal from "@/components/DisclaimerModal";

import { useEvents } from "@/hooks/useEvents";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useModals } from "@/hooks/useModals";
import { usePendingCounts } from "@/contexts/PendingCountsContext";
import { api } from "@/lib/api";

import type { Event } from "@/types/event";

interface UserInfo {
  id: string;
  username: string;
  idealBuddy?: string;
  interests?: string[];
  whyJoin?: string;
}

export default function FindBuddyPage() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showLaunchMenu, setShowLaunchMenu] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // Use custom hooks
  const { 
    userInfo, 
    createdEvents, 
    joinedEvents, 
    loading: userLoading,
    logout,
    checkPendingReviews,
    refreshJoinedEvents 
  } = useUserInfo();
  
  const { pendingReviewCount, pendingCheckinCount } = usePendingCounts();
  
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
    setShowModal,
    setShowDetail,
    setShowCancelModal,
    setShowEditModal,
    setShowReviewModal,
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


  const canCreateEvent = true;
  const isScoreLoaded = true;

  const filteredEvents = events.filter((e) => !e.expired);

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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 发起活动菜单 - Sticky Header */}
      {isScoreLoaded && (
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 z-30">
          <div className="relative inline-block" ref={menuRef}>
          <button
            onClick={handleLaunchClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all relative ${
              canCreateEvent
                ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 hover:border-indigo-300"
                : "text-gray-400 bg-gray-100 border-2 border-gray-200"
            }`}
          >
            <span className="text-sm font-bold">+</span> 找人一起
            {(pendingReviewCount > 0 || pendingCheckinCount > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                {pendingReviewCount + pendingCheckinCount}
              </span>
            )}
          </button>

          {showLaunchMenu && canCreateEvent && (
            <div className="absolute z-50 mt-2 left-0 bg-white rounded-lg shadow-lg border w-40">
              <button
                onClick={() => {
                  window.location.href = "/find-buddy/create";
                  setShowLaunchMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                📝 发个邀约
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(true);
                  setShowLaunchMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative flex items-center justify-between"
              >
                <span>👥 看看谁来了</span>
                <div className="flex items-center gap-1">
                  {pendingReviewCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                      {pendingReviewCount}
                    </span>
                  )}
                  {pendingCheckinCount > 0 && (
                    <span className="bg-green-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                      {pendingCheckinCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}
          </div>
        </div>
      )}

      {/* 活动卡片 */}
      <div className="p-4 space-y-4">
        {eventsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
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
      
      {/* Modals */}
      
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />
      
      {/* 免责声明 - Subtle sticky footer */}
      <div className="fixed bottom-12 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 px-6 py-1.5 z-20">
        <button
          onClick={() => setShowDisclaimerModal(true)}
          className="w-full text-[10px] text-gray-500 hover:text-gray-700 transition-colors text-center"
        >
          免责声明 | Disclaimer
        </button>
      </div>
    </div>
  );
}