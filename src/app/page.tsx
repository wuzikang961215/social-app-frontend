"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/event/ConfirmModal";
import EventDetailModal from "@/components/event/EventDetailModal";
import { MapPin, Clock, Users, LogOut } from "lucide-react";

interface Event {
  id: string;
  title: string;
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
  isVipOrganizer: boolean;
}

export default function HomePage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("首页");

  const uniqueCategories = Array.from(new Set(events.map((e) => e.category)));
  const categories = ["首页", ...uniqueCategories];

  const filteredEvents =
    selectedCategory === "首页"
      ? events.filter((e) => !e.expired)
      : events.filter((e) => e.category === selectedCategory && !e.expired);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const userRes = await axios.get("http://localhost:3002/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUserId = userRes.data.id;

        const eventsRes = await axios.get("http://localhost:3002/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();

        const transformed = eventsRes.data
          .map((e: any) => {
            const date = new Date(e.date);
            const countdown = Math.floor((date.getTime() - now.getTime()) / 3600000);
            const approvedCount = e.participants.filter((p: any) => p.status === "approved").length;
            const currentUser = e.participants.find((p: any) => p.user.id === currentUserId);

            return {
              id: e.id,
              title: e.title,
              time: formatTime(e.date),
              rawDate: date,
              location: e.location,
              category: e.category,
              description: e.description,
              tags: e.tags,
              maxParticipants: e.maxParticipants,
              spotsLeft: e.maxParticipants - approvedCount,
              expired: e.expired,
              countdown,
              organizer: {
                name: e.creator?.username || "等待确认",
                avatar: "/avatar1.png",
                id: e.creator?.id || "unknown",
              },
              participants: e.participants || [],
              userStatus: currentUser?.status || null,
              isVipOrganizer: false,
            };
          })
          .sort((a, b) => {
            if (a.spotsLeft === 0 && b.spotsLeft > 0) return 1;
            if (a.spotsLeft > 0 && b.spotsLeft === 0) return -1;
            if (a.countdown < 6 && b.countdown >= 6) return -1;
            if (a.countdown >= 6 && b.countdown < 6) return 1;
            if (a.spotsLeft <= 2 && b.spotsLeft > 2) return -1;
            if (a.spotsLeft > 2 && b.spotsLeft <= 2) return 1;
            return a.countdown - b.countdown;
          });

        setEvents(transformed);
      } catch (err) {
        console.error("加载失败", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const formatTime = (dateString: string) => {
    const now = new Date();
    const target = new Date(dateString);
    const timeStr = `${target.getHours().toString().padStart(2, "0")}:${target.getMinutes().toString().padStart(2, "0")}`;
    const nowDate = now.toDateString();
    const targetDate = target.toDateString();

    if (targetDate === nowDate) return `今天 ${timeStr}`;
    if (new Date(now.getTime() + 86400000).toDateString() === targetDate) return `明天 ${timeStr}`;
    if (new Date(now.getTime() + 2 * 86400000).toDateString() === targetDate) return `后天 ${timeStr}`;

    return target.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCardStyle = (event: Event) => {
    if (event.isVipOrganizer) return "border-blue-300 bg-blue-50";
    if (event.countdown <= 6 || (event.spotsLeft <= 2 && event.spotsLeft > 0)) return "border-yellow-200 bg-yellow-50";
    return "border-gray-200 bg-white";
  };

  const handleConfirm = () => {
    if (selectedEvent) {
      alert(`已报名「${selectedEvent.title}」！`);
      setShowModal(false);
      setShowDetail(false);
    }
  };

  const handleJoinFromDetail = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);  
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

      {/* 退出按钮 */}
      <div className="flex justify-between items-center mb-6">
        <LogOut
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="absolute top-4 right-4 w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer"
        />
      </div>

      {/* 活动卡片 */}
      {filteredEvents.map((event) => (
        <Card
          key={event.id}
          className={`rounded-2xl border transition-shadow shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform cursor-pointer ${getCardStyle(event)}`}
          onClick={() => {
            setSelectedEvent(event);
            setShowDetail(true);
          }}
        >
          <CardContent className="p-7 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-800">{event.title}</h2>
              <p className="text-sm text-gray-500 mt-1 italic">{event.category}</p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className={event.time.startsWith("今天") ? "font-semibold" : ""}>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span>
                    剩余名额：
                    <span className={event.spotsLeft <= 1 ? "font-semibold" : ""}>
                      {event.spotsLeft === 0 ? "已满" : `${event.spotsLeft}人`}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-2">
              {/* 主办人链接 */}
              <Link
                href={`/profile/${event.organizer.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 hover:underline"
              >
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{event.organizer.name}</div>
                  <div className="text-xs text-gray-500">主办人</div>
                </div>
              </Link>

              {/* 报名按钮 */}
              <Button
                className={`rounded-full px-4 py-2 text-sm transition ${
                  !event.userStatus || event.userStatus === "cancelled"
                    ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                    : ["approved", "checkedIn", "pending", "requestingCancellation"].includes(event.userStatus)
                    ? "bg-gray-300 text-gray-1000 cursor-default"
                    : ["denied", "noShow"].includes(event.userStatus)
                    ? "bg-red-100 text-red-600 cursor-default"
                    : ""
                }`}
                disabled={event.userStatus && event.userStatus !== "cancelled"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!event.userStatus || event.userStatus === "cancelled") {
                    setSelectedEvent(event);
                    setShowModal(true);
                  }
                }}
              >
                {event.userStatus === "approved"
                  ? "已确认"
                  : event.userStatus === "pending"
                  ? "等待审核"
                  : event.userStatus === "denied"
                  ? "报名被拒"
                  : event.userStatus === "checkedIn"
                  ? "已签到"
                  : event.userStatus === "noShow"
                  ? "未到场"
                  : event.userStatus === "requestingCancellation"
                  ? "取消申请中"
                  : "立即报名"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* 报名确认弹窗 */}
      {selectedEvent && (
        <ConfirmModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          title={selectedEvent.title}
        />
      )}

      {/* 活动详情弹窗 */}
      {selectedEvent && (
        <EventDetailModal
          open={showDetail}
          onClose={() => setShowDetail(false)}
          event={selectedEvent}
          onJoinClick={handleJoinFromDetail}
        />
      )}
    </div>
  );
}
