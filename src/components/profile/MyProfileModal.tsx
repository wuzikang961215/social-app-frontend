"use client";

import { useState } from "react";
import { User, Users, CalendarIcon } from "lucide-react";
import SectionHeader from "@/components/profile/SectionHeader";
import UserInfoCard from "@/components/profile/UserInfoCard";
import CollapsibleList from "@/components/profile/CollapsibleList";
import EventCard from "@/components/profile/EventCard";

export default function MyProfileModal({
  open,
  onClose,
  userInfo,
  createdEvents,
  joinedEvents,
}: {
  open: boolean;
  onClose: () => void;
  userInfo: {
    id: string;
    username: string;
    isVIP?: boolean;
    score?: number;
    idealBuddy?: string;
    whyJoin?: string;
    interests?: string[];
  };
  
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

  if (!open) return null;

  // ✅ 统一 enrich 所有活动
  const enrichEvents = (events: any[], userId: string) =>
    events.map((e) => {
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

  const enrichedCreated = enrichEvents(createdEvents, userInfo?.id);
  const enrichedJoined = enrichEvents(joinedEvents, userInfo?.id);

  const upcomingCreated = enrichedCreated.filter((e) => !e.expired);
  const pastCreated = enrichedCreated.filter((e) => e.expired);
  const upcomingJoined = enrichedJoined.filter((e) => !e.expired);
  const pastJoined = enrichedJoined.filter((e) => e.expired);

  const toggle = (key: keyof typeof collapsed) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="w-full max-w-md h-full bg-white p-6 overflow-y-auto relative space-y-6 shadow-xl">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 👤 用户信息 */}
        <SectionHeader icon={<User className="text-indigo-500" size={20} />} title="我的个人资料" />
        <UserInfoCard user={userInfo} />

        {/* 📆 我发起的活动 */}
        <SectionHeader icon={<CalendarIcon className="text-yellow-500" size={20} />} title="我发起的活动" />

        <CollapsibleList
          title="即将到来"
          collapsed={collapsed.createdUpcoming}
          onToggle={() => toggle("createdUpcoming")}
        >
          {upcomingCreated.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              showAction
              actionLabel="审核申请"
              onAction={() => alert(`审核活动：${e.title}（待实现）`)}
              userStatus={e.userStatus}
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
              showAction
              actionLabel="管理签到"
              onAction={() => alert(`签到管理：${e.title}（待实现）`)}
              userStatus={e.userStatus}
            />
          ))}
        </CollapsibleList>

        {/* 👥 我参与的活动 */}
        <SectionHeader icon={<Users className="text-green-500" size={20} />} title="我参与的活动" />

        <CollapsibleList
          title="即将到来"
          collapsed={collapsed.joinedUpcoming}
          onToggle={() => toggle("joinedUpcoming")}
        >
          {upcomingJoined.map((e) => (
            <EventCard key={e.id} event={e} userStatus={e.userStatus} />
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
    </div>
  );
}
