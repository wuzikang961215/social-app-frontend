"use client";

import { useEffect, useState } from "react";
import { X, HeartHandshake, BadgeCheck, Calendar, Users } from "lucide-react";
import { getManageEvents, reviewParticipant, markAttendance, api } from "@/lib/api";
import { formatTimeRange } from "@/lib/format";
import { hasEventStarted } from "@/lib/dateUtils";

type ReviewAndCheckinModalProps = {
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void; // Optional callback for immediate updates
};

type Participant = {
  user: {
    id: string;
    username: string;
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
  onUpdate,
}: ReviewAndCheckinModalProps) {
  const [data, setData] = useState<EventItem[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [userStats, setUserStats] = useState<Record<string, any>>({});

  // Use the imported hasEventStarted function from dateUtils

  const fetchData = async () => {
    try {
      const res = await getManageEvents();
      setData(res.data);
      
      // Fetch stats for all users
      const allUserIds = new Set<string>();
      res.data.forEach((event: EventItem) => {
        event.participants.forEach(p => {
          if (p.status === "pending" || (p.status === "approved" && hasEventStarted(event.startTime))) {
            allUserIds.add(p.user.id);
          }
        });
      });
      
      // Fetch stats in parallel
      const statsPromises = Array.from(allUserIds).map(async (userId) => {
        try {
          const stats = await api.user.getStats(userId);
          return { userId, stats };
        } catch (err) {
          console.error(`Failed to fetch stats for user ${userId}`, err);
          return { userId, stats: null };
        }
      });
      
      const statsResults = await Promise.all(statsPromises);
      const statsMap: Record<string, any> = {};
      statsResults.forEach(({ userId, stats }) => {
        if (stats) {
          statsMap[userId] = stats;
        }
      });
      setUserStats(statsMap);
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
      await reviewParticipant(eventId, userId, approve);
      await fetchData();
      onUpdate?.(); // Call the update callback if provided
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
      await markAttendance(eventId, userId, attended);
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
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md text-sm font-semibold text-gray-700 border-l-4 border-indigo-400">
            <span>待审核</span>
            {data.reduce((count, event) => count + event.participants.filter(p => p.status === "pending").length, 0) > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {data.reduce((count, event) => count + event.participants.filter(p => p.status === "pending").length, 0)}
              </span>
            )}
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

                  <div className="pt-3 text-sm text-gray-700 space-y-2">
                    <div className="font-semibold">
                      {p.user.username}
                    </div>
                    
                    {/* User Stats */}
                    {userStats[p.user.id] && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">发起</span>
                            <span className="font-bold text-gray-900 text-base">{userStats[p.user.id].createdCount}</span>
                            <span className="text-gray-600">场活动</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">参与</span>
                            <span className="font-bold text-gray-900 text-base">{userStats[p.user.id].participatedCount}</span>
                            <span className="text-gray-600">场活动</span>
                          </div>
                        </div>
                        
                        {userStats[p.user.id].participatedCount > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">到场率</span>
                              <span className={`font-bold ${
                                userStats[p.user.id].attendanceRate >= 90 ? "text-green-700" :
                                userStats[p.user.id].attendanceRate >= 70 ? "text-yellow-700" : 
                                "text-red-700"
                              }`}>
                                {userStats[p.user.id].attendanceRate}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-700 ${
                                  userStats[p.user.id].attendanceRate >= 90 ? "bg-green-500" :
                                  userStats[p.user.id].attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${userStats[p.user.id].attendanceRate}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <HeartHandshake size={16} className="text-indigo-400 mt-0.5" />
                      想遇见的朋友：&ldquo;{p.user.idealBuddy || "未填写"}&rdquo;
                    </div>
                    <div className="flex items-start gap-2">
                      <BadgeCheck size={16} className="text-green-400 mt-0.5" />
                      爱好：{p.user.interests?.join("、") || "未填写"}
                    </div>
                    <p className="italic text-gray-500">
                      &ldquo;{p.user.whyJoin || "未填写"}&rdquo;
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
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md text-sm font-semibold text-gray-700 border-l-4 border-indigo-400">
            <span>待签到</span>
            {data.reduce((count, event) => 
              count + event.participants.filter(p => p.status === "approved" && hasEventStarted(event.startTime)).length, 0
            ) > 0 && (
              <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {data.reduce((count, event) => 
                  count + event.participants.filter(p => p.status === "approved" && hasEventStarted(event.startTime)).length, 0
                )}
              </span>
            )}
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

                  <div className="pt-3 text-sm text-gray-700 space-y-2">
                    <div className="font-semibold">
                      {p.user.username}
                    </div>
                    
                    {/* User Stats */}
                    {userStats[p.user.id] && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">发起</span>
                            <span className="font-bold text-gray-900 text-base">{userStats[p.user.id].createdCount}</span>
                            <span className="text-gray-600">场活动</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">参与</span>
                            <span className="font-bold text-gray-900 text-base">{userStats[p.user.id].participatedCount}</span>
                            <span className="text-gray-600">场活动</span>
                          </div>
                        </div>
                        
                        {userStats[p.user.id].participatedCount > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">到场率</span>
                              <span className={`font-bold ${
                                userStats[p.user.id].attendanceRate >= 90 ? "text-green-700" :
                                userStats[p.user.id].attendanceRate >= 70 ? "text-yellow-700" : 
                                "text-red-700"
                              }`}>
                                {userStats[p.user.id].attendanceRate}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-700 ${
                                  userStats[p.user.id].attendanceRate >= 90 ? "bg-green-500" :
                                  userStats[p.user.id].attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                                }`}
                                style={{ width: `${userStats[p.user.id].attendanceRate}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <HeartHandshake size={16} className="text-indigo-400 mt-0.5" />
                      想遇见的朋友：&ldquo;{p.user.idealBuddy || "未填写"}&rdquo;
                    </div>
                    <div className="flex items-start gap-2">
                      <BadgeCheck size={16} className="text-green-400 mt-0.5" />
                      爱好：{p.user.interests?.join("、") || "未填写"}
                    </div>
                    <p className="italic text-gray-500">
                      &ldquo;{p.user.whyJoin || "未填写"}&rdquo;
                    </p>
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
