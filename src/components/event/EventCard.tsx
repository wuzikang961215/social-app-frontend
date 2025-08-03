import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Users } from "lucide-react";
import { formatTimeRange } from "@/lib/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EventCardProps {
  event: any;
  onClick?: () => void;
  onJoinClick?: () => void;
  onCancelClick?: () => void;
  onEditClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onJoinClick, onCancelClick, onEditClick }) => {
  const buttonLabel = (() => {
    if (event.isOrganizer) return "编辑活动";
    if ((event.userCancelCount ?? 0) >= 2) return "无法加入";
    switch (event.userStatus) {
      case "approved":
        return "已加入";
      case "checkedIn":
        return "已签到";
      case "pending":
      case "denied":
        return "等待通过";
      case "noShow":
        return "未到场";
      case "requestingCancellation":
        return "取消申请中";
      default:
        return event.spotsLeft > 0 ? "我想加入" : "已满";
    }
  })();

  const disabled =
    (event.userCancelCount ?? 0) >= 2 ||
    ["approved", "checkedIn", "requestingCancellation"].includes(event.userStatus) ||
    (event.spotsLeft <= 0 && !["pending", "denied"].includes(event.userStatus));

  return (
    <Card
      onClick={onClick}
      className="rounded-xl border shadow-sm cursor-pointer border-gray-200 bg-white"
    >
      <CardContent className="p-4 space-y-3">
        {/* 标题 + 分类 */}
        <div>
          <h2 className="text-base font-bold text-gray-800">{event.title}</h2>
          <p className="text-xs text-gray-500 mt-0.5 italic">{event.category}</p>
        </div>

        {/* 描述 */}
        {event.description && (
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-700 line-clamp-2">
              {event.description}
            </p>
          </div>
        )}

        {/* 地点、时间、剩余名额 */}
        <div className="text-xs text-gray-600 space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-gray-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span className={event.time?.startsWith("今天") ? "font-semibold" : ""}>
              {formatTimeRange(event.startTime, event.durationMinutes)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <span>
              剩余名额：
              <span className={event.spotsLeft <= 2 ? "font-semibold" : ""}>
                {event.spotsLeft === 0 ? "已满" : `${event.spotsLeft}人`}
              </span>
            </span>
          </div>
        </div>

        {/* 发起人 + 按钮 */}
        <div className="flex justify-between items-center pt-2 mt-1">
          <Link
            href={`/profile/${event.organizer.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            <div className="text-xs text-gray-700">
              <div className="font-medium">{event.organizer.name}</div>
              <div className="text-[10px] text-gray-500">发起人</div>
            </div>
          </Link>


          <Button
            className={`
              rounded-full px-4 py-2 text-sm transition
              ${
                event.isOrganizer
                  ? "bg-indigo-500 text-white"
                  : (event.userCancelCount ?? 0) >= 2
                  ? "bg-red-100 text-red-600 cursor-default"
                  : (!event.userStatus || event.userStatus === "cancelled") && event.spotsLeft > 0
                  ? "bg-indigo-500 text-white"
                  : event.userStatus === "approved"
                  ? "bg-emerald-500 text-white cursor-default"
                  : event.userStatus === "checkedIn"
                  ? "bg-cyan-500 text-white cursor-default"
                  : event.userStatus === "pending" || event.userStatus === "denied"
                  ? "bg-gray-300 text-gray-800"
                  : event.userStatus === "requestingCancellation"
                  ? "bg-gray-300 text-gray-800 cursor-default"
                  : event.userStatus === "noShow"
                  ? "bg-red-100 text-red-600 cursor-default"
                  : event.spotsLeft <= 0
                  ? "bg-gray-300 text-gray-800 cursor-default"
                  : ""
              }
            `}
            disabled={event.isOrganizer ? false : disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (event.isOrganizer) {
                onEditClick?.();
                return;
              }
              if (disabled) return;
              if (!event.userStatus || event.userStatus === "cancelled") {
                onJoinClick?.();
              } else if (event.userStatus === "pending" || event.userStatus === "denied") {
                onCancelClick?.();
              }
            }}
          >
            {buttonLabel}
          </Button>

        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
