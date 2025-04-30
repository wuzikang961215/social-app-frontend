"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  User,
  HeartHandshake,
  BadgeCheck,
  X,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/utils/api";
import type { Event as AppEvent } from "@/app/page";

type EventDetailModalProps = {
  open: boolean;
  onClose: () => void;
  event: {
    title: string;
    description?: string;
    tags?: string[];
    location: string;
    time: string;
    maxParticipants: number;
    spotsLeft: number;
    organizer?: {
      id?: string;
      name?: string;
      level?: number;
    };
    participants?: {
      user: {
        id: string;
        username: string;
        level?: number;
      };
      status: string;
      cancelCount?: number;
    }[];
    userStatus?: string;
    isOrganizer?: boolean;
    userCancelCount?: number;
  };
  onJoinClick?: (event: AppEvent) => void;
  onCancelClick?: (event: AppEvent) => void;
};

// 🔧 封装轻量 event => AppEvent 的转换
function toFullEvent(event: EventDetailModalProps["event"]): AppEvent {
  return {
    id: "temporary-id", // ⚠️ 如果你希望传真实 ID，需要父组件也传 id 进来
    title: event.title,
    startTime: "2025-01-01T00:00:00Z", // ⚠️ 同样建议从上层传入
    durationMinutes: 90,
    time: event.time,
    location: event.location,
    category: "其他",
    description: event.description || "",
    tags: event.tags || [],
    maxParticipants: event.maxParticipants,
    spotsLeft: event.spotsLeft,
    expired: false,
    countdown: 0,
    organizer: {
      id: event.organizer?.id || "",
      name: event.organizer?.name || "",
      avatar: "/avatar1.png",
    },
    participants: event.participants?.map((p) => ({
      user: {
        id: p.user.id,
        username: p.user.username,
        score: 0, // 补字段
      },
      status: p.status as any,
      cancelCount: p.cancelCount ?? 0,
    })) || [],
    userStatus: event.userStatus ?? null,
    userCancelCount: event.userCancelCount ?? 0,
    isVipOrganizer: false,
    isOrganizer: event.isOrganizer ?? false,
  };
}

export default function EventDetailModal({
  open,
  onClose,
  event,
  onJoinClick,
  onCancelClick,
}: EventDetailModalProps) {
  const [organizerInfo, setOrganizerInfo] = useState<{
    idealBuddy?: string;
    hobbies?: string[];
    whyJoin?: string;
  }>({});

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (event.organizer?.id) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${BASE_URL}/api/auth/users/${event.organizer.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOrganizerInfo({
            idealBuddy: res.data.idealBuddy,
            hobbies: res.data.interests,
            whyJoin: res.data.whyJoin,
          });
        } catch (err) {
          console.error("获取主办人信息失败", err);
        }
      }
    };

    if (open) fetchOrganizer();
  }, [event.organizer?.id, open]);

  const approvedParticipants = (event.participants || []).filter(
    (p) => p.status === "approved"
  );
  const tags = event.tags || [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40" />

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              key="modal-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
              <p className="italic text-sm text-gray-600 whitespace-pre-line">
                {event.description || "（暂无介绍）"}
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="font-medium">地点：</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="font-medium">时间：</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <p>
                    <span className="font-medium">剩余名额：</span>
                    {event.spotsLeft > 0 ? (
                      <>{event.spotsLeft} (最多 {event.maxParticipants} 人）</>
                    ) : (
                      <span className="font-bold">已满</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <User size={18} className="text-gray-500" />
                  主办人
                </div>
                <div>
                  {event.organizer?.name || "未命名"}{" "}
                  <span className="text-xs text-gray-500">
                    Lv.{event.organizer?.level ?? "?"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <HeartHandshake size={16} className="text-indigo-400 mt-0.5" />
                  <span>
                    想遇见的朋友：“{organizerInfo.idealBuddy || "未填写"}”
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <BadgeCheck size={16} className="text-green-400 mt-0.5" />
                  <span>
                    爱好：{organizerInfo.hobbies?.join("、") || "未填写"}
                  </span>
                </div>
                <p className="italic text-gray-500 text-sm">
                  “{organizerInfo.whyJoin || "TA 还没填写为什么想加入"}”
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Users size={18} className="text-gray-500" />
                  已加入（{approvedParticipants.length} 人）
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {approvedParticipants.map((p) => (
                    <div
                      key={p.user.id}
                      className="px-3 py-1 rounded-lg text-sm text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition cursor-pointer"
                    >
                      {p.user.username} · Lv.{p.user.level}
                    </div>
                  ))}
                </div>
              </div>

              {(onJoinClick || onCancelClick) && (
                <div className="pt-2 flex justify-end">
                  <Button
                    className={`
                      rounded-full px-4 py-2 text-sm transition
                      ${
                        event.isOrganizer
                          ? "bg-gray-300 text-gray-800 cursor-default"
                          : (event.userCancelCount ?? 0) >= 2
                          ? "bg-red-100 text-red-600 cursor-default"
                          : !event.userStatus || event.userStatus === "cancelled"
                          ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                          : event.userStatus === "approved"
                          ? "bg-emerald-500 text-white cursor-default"
                          : event.userStatus === "checkedIn"
                          ? "bg-cyan-500 text-white cursor-default"
                          : event.userStatus === "pending"
                          ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                          : event.userStatus === "requestingCancellation"
                          ? "bg-gray-300 text-gray-800"
                          : ["denied", "noShow"].includes(event.userStatus)
                          ? "bg-red-100 text-red-600 cursor-default"
                          : ""
                      }
                    `}
                    disabled={
                      event.isOrganizer ||
                      (event.userCancelCount ?? 0) >= 2 ||
                      !["pending", "cancelled", null].includes(event.userStatus || null)
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      if (
                        event.isOrganizer ||
                        (event.userCancelCount ?? 0) >= 2 ||
                        !["pending", "cancelled", null].includes(event.userStatus || null)
                      )
                        return;

                      const fullEvent = toFullEvent(event);

                      if (!event.userStatus || event.userStatus === "cancelled") {
                        onJoinClick?.(fullEvent);
                      } else if (event.userStatus === "pending") {
                        onCancelClick?.(fullEvent);
                      }
                    }}
                  >
                    {event.isOrganizer
                      ? "你是主办人"
                      : (event.userCancelCount ?? 0) >= 2
                      ? "无法加入"
                      : event.userStatus === "approved"
                      ? "已加入"
                      : event.userStatus === "pending"
                      ? event.spotsLeft === 0
                        ? "候补中"
                        : "等待审核"
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
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
