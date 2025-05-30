import { User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/app/page"; // 👈 or wherever你定义的Event类型

export default function EventCard({
  event,
  userStatus,
  showAction,
  actionLabel,
  onAction,
}: {
  event: Event;
  userStatus?: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const isPast = event.expired;

  const getStatusStyle = (status: string | undefined) => {
    switch (status) {
      case "approved":
      case "checkedIn":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "pending":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "noShow":
      case "cancelled":
      default:
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
    }
  };

  // ✅ 只展示 approved 用户
  // ✅ 根据是否已过期展示不同的参与者状态
  const relevantParticipants = event.participants?.filter((p) =>
    isPast ? p.status === "checkedIn" : p.status === "approved"
  ) || [];


  return (
    <div className="p-4 bg-white text-sm relative">
      <div className="font-bold text-gray-800">{event.title}</div>
      <div className="text-gray-500 italic">
        🕒 {event.startTime} ｜ 📍{event.location}
        {event.spotsLeft != null && !isPast && ` ｜ 剩余名额：${event.spotsLeft}人`}
      </div>

      {/* 主办人 */}
      {userStatus && event.creator?.username && (
        <div className="text-gray-700 space-y-1 mt-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 italic">
            <User size={14} className="text-gray-400" />
            主办人
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-gray-600 text-xs shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => console.log(`点击了主办人 ${event.creator?.username}`)}
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              {event.creator?.username}
            </span>
          </div>
        </div>
      )}

      {/* 参与者 */}
      <div className="text-gray-700 space-y-1 mt-2">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1 mt-5 italic">
          <Users size={14} className="text-gray-400" />
          {isPast ? "已签到" : "已加入"}（{relevantParticipants.length}人）
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {relevantParticipants.map((p) => (
            <span
              key={p.user.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-gray-600 text-xs shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => console.log(`点击了参与者 ${p.user.username}`)}
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              {p.user.username}
            </span>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-end pt-4">
        {userStatus ? (
          <Button
            size="sm"
            className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(userStatus)}`}
          >
            {userStatus === "approved"
              ? "已加入"
              : userStatus === "pending"
              ? "等待审核"
              : userStatus === "checkedIn"
              ? "已签到"
              : userStatus === "noShow"
              ? "未到场"
              : "取消申请中"}
          </Button>
        ) : (
          showAction && (
            <Button
              size="sm"
              className="text-xs px-3 py-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
