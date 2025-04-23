"use client";

import { useEffect, useState } from "react";
import { X, HeartHandshake, BadgeCheck } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/api";

type ReviewAndCheckinModalProps = {
  open: boolean;
  onClose: () => void;
};

type Participant = {
  user: {
    id: string;
    username: string;
    level?: number;
    idealBuddy?: string;
    interests?: string[];
    whyJoin?: string;
  };
  status: string;
};

type EventItem = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  durationMinutes: number;
  maxParticipants: number;
  participants: Participant[];
};

export default function ReviewAndCheckinModal({
  open,
  onClose,
}: ReviewAndCheckinModalProps) {
  const [data, setData] = useState<EventItem[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const hasEventStarted = (start: string) => new Date() >= new Date(start);

  const formatTimeRange = (start: string, duration: number) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const format = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const prefix = (() => {
      const now = new Date();
      const nowStr = now.toDateString();
      const startStr = startDate.toDateString();
      if (startStr === nowStr) return "今天";
      if (new Date(now.getTime() + 86400000).toDateString() === startStr) return "明天";
      if (new Date(now.getTime() + 2 * 86400000).toDateString() === startStr) return "后天";
      return startDate.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
    })();

    return `${prefix} ${format(startDate)} - ${format(endDate)}`;
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/events/manage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("获取数据失败", err);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const handleReview = async (
    eventId: string,
    userId: string,
    approve: boolean
  ) => {
    try {
      setLoadingMap((prev) => ({ ...prev, [userId + eventId]: true }));
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/events/${eventId}/review`,
        { userId, approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
    } finally {
      setLoadingMap((prev) => ({ ...prev, [userId + eventId]: false }));
    }
  };

  const handleAttendance = async (
    eventId: string,
    userId: string,
    attended: boolean
  ) => {
    try {
      setLoadingMap((prev) => ({ ...prev, [userId + eventId]: true }));
      const token = localStorage.getItem("token");
      await axios.post(
        `${BASE_URL}/api/events/${eventId}/attendance`,
        { userId, attended },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
    } finally {
      setLoadingMap((prev) => ({ ...prev, [userId + eventId]: false }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-xl p-6 relative space-y-6">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 text-center">活动审核与签到</h2>

        {/* 审核区 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md text-sm font-semibold text-gray-700 border-l-4 border-indigo-400">
            <span>待审核</span>
          </div>
          {data.flatMap((event) =>
            event.participants
              .filter((p) => p.status === "pending")
              .map((p) => (
                <div
                  key={p.user.id + event.id}
                  className="border rounded-xl p-4 space-y-2 bg-white"
                >
                  <div className="text-sm font-bold text-gray-800">{event.title}</div>
                  <div className="text-sm text-gray-500 italic">
                    🕒 {formatTimeRange(event.startTime, event.durationMinutes)} ｜ 📍
                    {event.location} ｜ 剩余名额：
                    {event.maxParticipants -
                      event.participants.filter((p) => p.status === "approved").length}{" "}
                    人
                  </div>

                  <div className="pt-3 text-sm text-gray-700 space-y-1">
                    <div className="font-semibold">
                      {p.user.username}{" "}
                      <span className="text-xs text-gray-500">Lv.{p.user.level}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <HeartHandshake size={16} className="text-indigo-400 mt-0.5" />
                      想遇见的朋友：“{p.user.idealBuddy || "未填写"}”
                    </div>
                    <div className="flex items-start gap-2">
                      <BadgeCheck size={16} className="text-green-400 mt-0.5" />
                      爱好：{p.user.interests?.join("、") || "未填写"}
                    </div>
                    <p className="italic text-gray-500">
                      “{p.user.whyJoin || "未填写"}”
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      disabled={loadingMap[p.user.id + event.id]}
                      onClick={() => handleReview(event.id, p.user.id, true)}
                      className="px-4 py-1.5 rounded-md bg-indigo-500 text-white text-sm font-semibold shadow-sm hover:bg-indigo-600 transition"
                    >
                      同意参加
                    </button>
                    <button
                      disabled={loadingMap[p.user.id + event.id]}
                      onClick={() => handleReview(event.id, p.user.id, false)}
                      className="px-4 py-1.5 rounded-md border border-rose-300 text-rose-500 text-sm font-medium bg-white hover:bg-rose-50 transition"
                    >
                      拒绝
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* 签到区 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md text-sm font-semibold text-gray-700 border-l-4 border-indigo-400">
            <span>待签到</span>
          </div>
          {data.flatMap((event) =>
            event.participants
              .filter((p) => p.status === "approved" && hasEventStarted(event.startTime))
              .map((p) => (
                <div
                  key={p.user.id + event.id}
                  className="border rounded-xl p-4 space-y-2 bg-white"
                >
                  <div className="text-sm font-bold text-gray-800">{event.title}</div>
                  <div className="text-sm text-gray-500 italic">
                    🕒 {formatTimeRange(event.startTime, event.durationMinutes)} ｜ 📍
                    {event.location}
                  </div>

                  <div className="pt-3 text-sm text-gray-700 space-y-1">
                    <div className="font-semibold">
                      {p.user.username}{" "}
                      <span className="text-xs text-gray-500">Lv.{p.user.level}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      disabled={loadingMap[p.user.id + event.id]}
                      onClick={() => handleAttendance(event.id, p.user.id, true)}
                      className="px-4 py-1.5 rounded-md bg-emerald-500 text-white text-sm font-semibold shadow-sm hover:bg-emerald-600 transition"
                    >
                      已到
                    </button>
                    <button
                      disabled={loadingMap[p.user.id + event.id]}
                      onClick={() => handleAttendance(event.id, p.user.id, false)}
                      className="px-4 py-1.5 rounded-md border border-rose-400 text-rose-500 text-sm font-medium bg-white hover:bg-rose-50 transition"
                    >
                      未到
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
