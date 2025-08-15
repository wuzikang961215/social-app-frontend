"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  User,
  HeartHandshake,
  BadgeCheck,
  CheckCircle,
  X,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserById, api } from "@/lib/api"; // ✅ 替代 axios + BASE_URL
import UserDetailPopover from "@/components/user/UserDetailPopover";
import { getMBTIDisplay } from "@/lib/mbtiConstants";
import { isOfficialAccount } from "@/lib/constants";
import { Linkify } from "@/lib/linkify";

import type { Event as AppEvent } from "@/types/event";

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
    };
    participants?: {
      user: {
        id: string;
        username: string;
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
  onEditClick?: (event: AppEvent) => void;
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
      },
      status: p.status as any,
      cancelCount: p.cancelCount ?? 0,
    })) || [],
    userStatus: event.userStatus ?? null,
    userCancelCount: event.userCancelCount ?? 0,
    isOrganizer: event.isOrganizer ?? false,
  };
}

export default function EventDetailModal({
  open,
  onClose,
  event,
  onJoinClick,
  onCancelClick,
  onEditClick,
}: EventDetailModalProps) {
  const [organizerInfo, setOrganizerInfo] = useState<{
    idealBuddy?: string;
    hobbies?: string[];
    whyJoin?: string;
    mbti?: string;
  }>({});
  
  const [organizerStats, setOrganizerStats] = useState<{
    createdCount: number;
    participatedCount: number;
    attendanceRate: number;
  } | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
    element: HTMLElement | null;
  } | null>(null);

  useEffect(() => {
    const fetchOrganizer = async () => {
      if (event.organizer?.id) {
        try {
          const [userRes, statsRes] = await Promise.all([
            getUserById(event.organizer.id),
            api.user.getStats(event.organizer.id)
          ]);
          
          setOrganizerInfo({
            idealBuddy: userRes.idealBuddy,
            hobbies: userRes.interests,
            whyJoin: userRes.whyJoin,
            mbti: userRes.mbti,
          });
          
          setOrganizerStats(statsRes);
        } catch (err) {
          console.error("获取发起人信息失败", err);
        }
      }
    };

    if (open) fetchOrganizer();
  }, [event.organizer?.id, open]);

  const approvedParticipants = (event.participants || []).filter(
    (p) => p.status === "approved"
  );
  const tags = event.tags || [];

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="relative bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-4 z-10 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-4">
              <h2 className="text-base font-bold text-gray-800">{event.title}</h2>
              <p className="italic text-xs text-gray-600 whitespace-pre-line">
                <Linkify>{event.description || "（暂无介绍）"}</Linkify>
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="font-medium">地点：</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="font-medium">时间：</span>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
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

              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <User size={14} className="text-gray-500" />
                  发起人
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium flex items-center gap-1">
                    {event.organizer?.name || "未命名"}
                    {isOfficialAccount(event.organizer?.id) && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#3B82F6"/>
                        <path d="M14.5 7L8.5 13L5.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  {organizerStats && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                        发起 {organizerStats.createdCount} 场
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Attendance Rate Bar */}
                {organizerStats && organizerStats.participatedCount > 0 && (
                  <div className="bg-white/50 rounded-lg p-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-600">到场率</span>
                      <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full ${
                        organizerStats.attendanceRate >= 90 ? "text-green-700 bg-green-100" :
                        organizerStats.attendanceRate >= 70 ? "text-yellow-700 bg-yellow-100" : 
                        "text-red-700 bg-red-100"
                      }`}>
                        {organizerStats.attendanceRate}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-700 ${
                          organizerStats.attendanceRate >= 90 ? "bg-green-500" :
                          organizerStats.attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${organizerStats.attendanceRate}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-1.5">
                  <Brain size={14} className="text-purple-400 mt-0.5" />
                  <span>MBTI：{getMBTIDisplay(organizerInfo.mbti)}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <HeartHandshake size={14} className="text-indigo-400 mt-0.5" />
                  <span>
                    想遇见的朋友：&ldquo;{organizerInfo.idealBuddy || "未填写"}&rdquo;
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <BadgeCheck size={14} className="text-green-400 mt-0.5" />
                  <span>
                    爱好：{organizerInfo.hobbies?.join("、") || "未填写"}
                  </span>
                </div>
                <p className="italic text-gray-500 text-[10px]">
                  "{organizerInfo.whyJoin || "TA 还没填写为什么想加入"}"
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Users size={14} className="text-gray-500" />
                  已加入（{approvedParticipants.length} 人）
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {approvedParticipants.map((p) => (
                    <div
                      key={p.user.id}
                      className="px-2.5 py-0.5 rounded-lg text-xs text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition cursor-pointer"
                      onClick={(e) => setSelectedUser({ 
                        id: p.user.id, 
                        username: p.user.username,
                        element: e.currentTarget
                      })}
                    >
                      {p.user.username}
                    </div>
                  ))}
                </div>
              </div>

              {(onJoinClick || onCancelClick || onEditClick) && (
                <div className="pt-1 flex justify-end">
                  <Button
                    className={`
                      rounded-full px-3 py-1.5 text-xs transition
                      ${
                        event.isOrganizer
                          ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                          : (event.userCancelCount ?? 0) >= 2
                          ? "bg-red-100 text-red-600 cursor-default"
                          : (!event.userStatus || event.userStatus === "cancelled") && event.spotsLeft > 0
                          ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                          : event.userStatus === "approved"
                          ? "bg-emerald-500 text-white cursor-default"
                          : event.userStatus === "checkedIn"
                          ? "bg-cyan-500 text-white cursor-default"
                          : event.userStatus === "pending" || event.userStatus === "denied"
                          ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                          : event.userStatus === "requestingCancellation"
                          ? "bg-gray-300 text-gray-800 cursor-default"
                          : event.userStatus === "noShow"
                          ? "bg-red-100 text-red-600 cursor-default"
                          : event.spotsLeft <= 0
                          ? "bg-gray-300 text-gray-800 cursor-default"
                          : ""
                      }
                    `}
                    disabled={
                      event.isOrganizer ? false : (
                        (event.userCancelCount ?? 0) >= 2 ||
                        !["pending", "denied", "cancelled", null].includes(event.userStatus || null) ||
                        (event.spotsLeft <= 0 && !["pending", "denied"].includes(event.userStatus || ""))
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      const fullEvent = toFullEvent(event);

                      if (event.isOrganizer) {
                        onEditClick?.(fullEvent);
                        return;
                      }

                      if (
                        (event.userCancelCount ?? 0) >= 2 ||
                        !["pending", "denied", "cancelled", null].includes(event.userStatus || null)
                      )
                        return;

                      if (!event.userStatus || event.userStatus === "cancelled") {
                        onJoinClick?.(fullEvent);
                      } else if (event.userStatus === "pending" || event.userStatus === "denied") {
                        onCancelClick?.(fullEvent);
                      }
                    }}
                  >
                    {event.isOrganizer
                      ? "编辑活动"
                      : (event.userCancelCount ?? 0) >= 2
                      ? "无法加入"
                      : event.userStatus === "approved"
                      ? "已加入"
                      : event.userStatus === "pending" || event.userStatus === "denied"
                      ? "等待通过"
                      : event.userStatus === "checkedIn"
                      ? "已签到"
                      : event.userStatus === "noShow"
                      ? "未到场"
                      : event.userStatus === "requestingCancellation"
                      ? "取消申请中"
                      : event.spotsLeft <= 0
                      ? "已满"
                      : "我想加入"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      
      {/* User Detail Popover */}
    {selectedUser && (
      <UserDetailPopover
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        userId={selectedUser.id}
        username={selectedUser.username}
        anchorEl={selectedUser.element}
      />
    )}
    </>
  );
}
