"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/event/ConfirmModal";
import EventDetailModal from "@/components/event/EventDetailModal";
import CancelModal from "@/components/event/CancelModal";
import ReviewAndCheckinModal from "@/components/event/ReviewAndCheckinModal";
import MyProfileModal from "@/components/profile/MyProfileModal";
import EventCard from "@/components/event/EventCard";

import {
  getUser,
  getCreatedEvents,
  getJoinedEvents,
  getEvents,
  joinEvent,
  cancelEvent,
} from "@/lib/api";

import { formatTimeRange } from "@/lib/format";



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
      score?: number;
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
  isVipOrganizer: boolean;
  isOrganizer: boolean;
}

interface UserInfo {
  id: string;
  username: string;
  idealBuddy?: string;
  interests?: string[];
  whyJoin?: string;
  score?: number;
}

export default function HomePage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("首页");
  const [showLaunchMenu, setShowLaunchMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const canCreateEvent = userInfo?.score !== undefined && userInfo.score >= 30;
  const isScoreLoaded = userInfo?.score !== undefined;

  const filteredEvents =
    selectedCategory === "首页"
      ? events.filter((e) => !e.expired)
      : events.filter((e) => e.category === selectedCategory && !e.expired);

  const getUserPriority = (event: Event): number => {
    if (event.isOrganizer) return 3;
    const status = event.userStatus;
    if (!status || status === "cancelled") return 0;
    if (status === "pending") return 1;
    if (status === "approved" || status === "checkedIn") return 2;
    return 4;
  };

  const handleLaunchClick = () => {
    if (!canCreateEvent) {
      toast.error(`积分不足，还需 ${30 - (userInfo?.score || 0)} 分才可发起活动`);
      return;
    }
    setShowLaunchMenu((prev) => !prev);
  };


  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const [userRes, createdRes, joinedRes] = await Promise.all([
          getUser(),
          getCreatedEvents(),
          getJoinedEvents(),
        ]);        
        setUserInfo(userRes.data);
        setCreatedEvents(createdRes.data);
        setJoinedEvents(joinedRes.data);

        const eventsRes = await getEvents();
        const now = new Date();
        const currentUserId = userRes.data.id;

        const transformed: Event[] = eventsRes.data.map((e: any): Event => {
          const date = new Date(e.startTime);
          const countdown = Math.floor((date.getTime() - now.getTime()) / 3600000);
          const approvedCount = e.participants.filter((p: any) => p.status === "approved").length;
          const currentUser = e.participants.find((p: any) => p.user.id === currentUserId);

          return {
            id: e.id,
            title: e.title,
            time: formatTimeRange(e.startTime, e.durationMinutes),
            startTime: e.startTime,
            durationMinutes: e.durationMinutes,
            location: e.location,
            category: e.category,
            description: e.description,
            tags: e.tags,
            maxParticipants: e.maxParticipants,
            spotsLeft: e.maxParticipants - approvedCount,
            expired: e.expired,
            countdown,
            creator: e.creator,
            organizer: {
              name: e.creator?.username || "等待确认",
              avatar: "/avatar1.png",
              id: e.creator?.id || "unknown",
            },
            participants: (e.participants || []).map((p: any) => ({
              user: {
                id: p.user.id,
                username: p.user.username,
                score: p.user.score,
              },
              status: p.status,
            })),
            userStatus: currentUser?.status ?? null,
            userCancelCount: currentUser?.cancelCount || 0,
            isVipOrganizer: false,
            isOrganizer: e.creator?.id === currentUserId,
          };
        });

        transformed.sort((a, b) => {
          const aPriority = getUserPriority(a);
          const bPriority = getUserPriority(b);
          if (aPriority !== bPriority) return aPriority - bPriority;

          const aFull = a.spotsLeft <= 0;
          const bFull = b.spotsLeft <= 0;
          if (aFull && !bFull) return 1;
          if (!aFull && bFull) return -1;

          const aScore = a.countdown + a.spotsLeft * 2;
          const bScore = b.countdown + b.spotsLeft * 2;
          return aScore - bScore;
        });

        setEvents(transformed);
      } catch (err) {
        console.error("加载失败", err);
      
        if (err instanceof Error && err.message.includes("Token")) {
          localStorage.removeItem("token");
          router.replace("/login");
        }
      }      
    };

    loadData();
  }, [router]);

  const handleConfirm = async () => {
    if (!selectedEvent) return;
    try {
      const data = await joinEvent(selectedEvent.id);
      toast.success(data.message || "报名成功！");
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id ? { ...ev, userStatus: "pending" } : ev
        )
      );
      setShowModal(false);
      setShowDetail(false);
    } catch {
      toast.error("报名失败，请稍后再试");
    }
  };
  
  const handleCancel = async () => {
    if (!selectedEvent) return;
    try {
      const data = await cancelEvent(selectedEvent.id);
      toast.success(data.message || "取消成功");
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                userStatus: "cancelled",
                userCancelCount: (ev.userCancelCount || 0) + 1,
              }
            : ev
        )
      );
      setShowCancelModal(false);
      setShowDetail(false);
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
            className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full transition ${
              canCreateEvent
                ? "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                : "text-gray-400 bg-gray-200"
            }`}
          >
            <span className="text-lg">➕</span> 组织活动
          </button>

          {showLaunchMenu && canCreateEvent && (
            <div className="absolute z-50 mt-2 left-0 bg-white rounded-lg shadow-lg border w-40">
              <button
                onClick={() => {
                  router.push("events/create");
                  setShowLaunchMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                创建新活动
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(true);
                  setShowLaunchMenu(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                审核与签到
              </button>
            </div>
          )}
        </div>
      )}

      {/* 登出按钮 */}
      <div className="flex justify-between items-center mb-6">
        <LogOut
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="absolute top-4 right-4 w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer"
        />
      </div>

      {/* 我的按钮 */}
      <button
        onClick={() => setShowProfileModal(true)}
        className="absolute top-20 right-4 flex gap-1 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition"
      >
        <span className="text-base">👤</span> 我的
      </button>

      {/* 活动卡片 */}
      {filteredEvents.map((event) => (
        <EventCard
          key={event.id}
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
        />      
      ))}

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
          />
        </>
      )}

      <ReviewAndCheckinModal open={showReviewModal} onClose={() => setShowReviewModal(false)} />
      <MyProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userInfo={userInfo!}
        createdEvents={createdEvents}
        joinedEvents={joinedEvents}
      />
    </div>
  );
}
