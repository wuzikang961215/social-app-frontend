"use client";

import { useState } from "react";
import { User, HeartHandshake, Users, BadgeCheck, X, CalendarIcon } from "lucide-react";
import SectionHeader from "@/components/profile/SectionHeader";
import UserInfoCard from "@/components/profile/UserInfoCard";
import CollapsibleList from "@/components/profile/CollapsibleList";
import EventCard from "@/components/profile/EventCard";

const myCreatedEvents = [
  {
    id: "e1",
    title: "羽毛球双打",
    startTime: "04-19 15:00 - 17:00",
    location: "大学体育馆",
    spotsLeft: 3,
    expired: false,
    participants: ["小明", "琪琪", "大卫"],
  },
  {
    id: "e2",
    title: "街拍摄影挑战",
    startTime: "04-11 10:00 - 12:00",
    location: "Botanic Garden",
    spotsLeft: 0,
    expired: true,
    participants: ["思思", "小鱼"],
  },
  {
    id: "e7",
    title: "狼人杀社交夜",
    startTime: "04-23 18:00 - 21:00",
    location: "City Cafe",
    spotsLeft: 1,
    expired: false,
    participants: ["Leo", "Amy"],
  },
];

const myJoinedEvents = [
  {
    id: "e3",
    title: "桌游聚会",
    startTime: "04-21 18:00 - 20:00",
    location: "City Game Bar",
    spotsLeft: 2,
    expired: false,
    userStatus: "approved",
    participants: ["思思", "小鱼"],
  },
  {
    id: "e4",
    title: "KTV大狂欢",
    startTime: "04-10 20:00 - 22:00",
    location: "唐人街KTV",
    spotsLeft: 0,
    expired: true,
    userStatus: "noShow",
    participants: ["思思", "小鱼"],
  },
  {
    id: "e5",
    title: "极限飞盘局",
    startTime: "04-25 16:00 - 18:00",
    location: "Central Park",
    spotsLeft: 1,
    expired: false,
    userStatus: "pending",
    participants: ["思思", "小鱼"],
  },
  {
    id: "e6",
    title: "电影放映会",
    startTime: "04-01 20:00 - 22:00",
    location: "UNSW Lecture Theatre",
    spotsLeft: 0,
    expired: true,
    userStatus: "checkedIn",
    participants: ["思思", "小鱼"],
  },
];

const userInfo = {
  username: "Harry",
  level: 4,
  idealBuddy: "真诚、主动、思想开放",
  hobbies: ["羽毛球", "看电影", "唱K"],
  whyJoin: "在澳洲太孤独了，希望找到志同道合的朋友",
};

export default function MyProfileModal({ open, onClose }) {
    const [collapsed, setCollapsed] = useState({
      createdUpcoming: false,
      createdPast: false,
      joinedUpcoming: false,
      joinedPast: false,
    });
  
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
        <div className="w-full max-w-md h-full bg-white p-6 overflow-y-auto relative space-y-6 shadow-xl">
          <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
            <X size={20} />
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
            {myCreatedEvents.filter(e => !e.expired).map(e => (
              <EventCard
                key={e.id}
                event={e}
                showAction
                actionLabel="审核申请"
                onAction={() => alert(`审核活动：${e.title}（待实现）`)}
              />
            ))}
          </CollapsibleList>
  
          <CollapsibleList
            title="已结束"
            collapsed={collapsed.createdPast}
            onToggle={() => toggle("createdPast")}
          >
            {myCreatedEvents.filter(e => e.expired).map(e => (
              <EventCard
                key={e.id}
                event={e}
                showAction
                actionLabel="管理签到"
                onAction={() => alert(`签到管理：${e.title}（待实现）`)}
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
            {myJoinedEvents.filter(e => !e.expired).map(e => (
              <EventCard key={e.id} event={e} userStatus={e.userStatus} />
            ))}
          </CollapsibleList>
  
          <CollapsibleList
            title="已结束"
            collapsed={collapsed.joinedPast}
            onToggle={() => toggle("joinedPast")}
          >
            {myJoinedEvents.filter(e => e.expired).map(e => (
              <EventCard key={e.id} event={e} userStatus={e.userStatus} />
            ))}
          </CollapsibleList>
        </div>
      </div>
    );
  
    function toggle(key) {
      setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
    }
  }