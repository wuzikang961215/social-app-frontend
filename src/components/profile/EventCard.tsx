import { useState } from "react";
import { User, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSimpleDate } from "@/lib/formatSimple";
import UserDetailPopover from "@/components/user/UserDetailPopover";
import { isOfficialAccount } from "@/lib/constants";

export default function EventCard({
  event,
  userStatus,
  showAction,
  actionLabel,
  onAction,
  onCancel,
  onEdit,
}: {
  event: any; // Accept any event object since it comes from backend
  userStatus?: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
}) {
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string; el: HTMLElement } | null>(null);
  const isPast = event.expired;

  const getStatusStyle = (status: string | undefined) => {
    switch (status) {
      case "approved":
      case "checkedIn":
        return "bg-emerald-500 text-white";
      case "pending":
        return "bg-gray-200 text-gray-800";
      case "noShow":
      case "cancelled":
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // ✅ 只展示 approved 用户
  // ✅ 根据是否已过期展示不同的参与者状态
  const relevantParticipants = event.participants?.filter((p: any) =>
    isPast ? p.status === "checkedIn" : p.status === "approved"
  ) || [];


  return (
    <div className="p-2.5 bg-white text-[11px] relative">
      <div className="font-bold text-gray-800 text-[11px]">{event.title}</div>
      <div className="text-gray-500 italic text-[9px]">
        🕒 {formatSimpleDate(event.startTime)} ｜ 📍{event.location}
        {event.spotsLeft != null && !isPast && ` ｜ 剩余名额：${event.spotsLeft}人`}
      </div>

      {/* 发起人 */}
      {userStatus && event.creator?.username && (
        <div className="text-gray-700 space-y-0.5 mt-3">
          <div className="flex items-center gap-1 text-[9px] text-gray-500 italic">
            <User size={11} className="text-gray-400" />
            发起人
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-gray-600 text-[9px] shadow-sm border border-gray-200 cursor-pointer"
              onClick={(e) => {
                setSelectedUser({ 
                  id: event.creator.id || event.creator._id, 
                  username: event.creator.username,
                  el: e.currentTarget
                });
              }}
            >
              {event.creator?.username}
              {isOfficialAccount(event.creator?.id || event.creator?._id) && (
                <svg className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#3B82F6"/>
                  <path d="M14.5 7L8.5 13L5.5 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          </div>
        </div>
      )}

      {/* 参与者 */}
      <div className="text-gray-700 space-y-0.5 mt-2">
        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5 mt-3 italic">
          <Users size={11} className="text-gray-400" />
          {isPast ? "已签到" : "已加入"}（{relevantParticipants.length}人）
        </div>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {relevantParticipants.map((p: any) => (
            <span
              key={p.user.id}
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-gray-600 text-[9px] shadow-sm border border-gray-200 cursor-pointer"
              onClick={(e) => {
                setSelectedUser({ 
                  id: p.user.id || p.user._id, 
                  username: p.user.username,
                  el: e.currentTarget
                });
              }}
            >
              {p.user.username}
            </span>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-end gap-1 pt-2">
        {onEdit && !isPast && (
          <Button
            size="sm"
            className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500 text-white"
            onClick={onEdit}
          >
            编辑
          </Button>
        )}
        {userStatus ? (
          <Button
            size="sm"
            className={`text-[10px] px-2.5 py-0.5 rounded-full ${getStatusStyle(userStatus)}`}
            onClick={(userStatus === "pending" || userStatus === "denied") && onCancel ? onCancel : undefined}
            disabled={!((userStatus === "pending" || userStatus === "denied") && onCancel)}
          >
            {userStatus === "approved"
              ? "已加入"
              : userStatus === "pending"
              ? "等待通过"
              : userStatus === "denied"
              ? "等待通过"  // Show same as pending
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
              className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500 text-white"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )
        )}
      </div>

      {/* User Detail Popover */}
      {selectedUser && (
        <UserDetailPopover
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          userId={selectedUser.id}
          username={selectedUser.username}
          anchorEl={selectedUser.el}
        />
      )}
    </div>
  );
}
