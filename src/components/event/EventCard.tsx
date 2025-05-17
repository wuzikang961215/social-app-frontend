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
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, onJoinClick, onCancelClick }) => {
  const buttonLabel = (() => {
    if (event.isOrganizer) return "你是主办人";
    if ((event.userCancelCount ?? 0) >= 2) return "无法加入";
    switch (event.userStatus) {
      case "approved":
        return "已加入";
      case "checkedIn":
        return "已签到";
      case "pending":
        return event.spotsLeft === 0 ? "候补中" : "等待审核";
      case "denied":
        return "报名被拒";
      case "noShow":
        return "未到场";
      case "requestingCancellation":
        return "取消申请中";
      default:
        return "立即报名";
    }
  })();

  const disabled =
    event.isOrganizer ||
    (event.userCancelCount ?? 0) >= 2 ||
    !["pending", "cancelled", null].includes(event.userStatus ?? null);

  return (
    <Card
      onClick={onClick}
      className={`
        rounded-2xl border transition-shadow shadow-md hover:shadow-lg
        hover:scale-[1.01] transition-transform cursor-pointer
        ${event.isVipOrganizer ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}
      `}
    >
      <CardContent className="p-7 space-y-4">
        {/* 标题 + 分类 */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-800">{event.title}</h2>
          <p className="text-sm text-gray-500 mt-1 italic">{event.category}</p>
        </div>

        {/* 地点、时间、剩余名额 */}
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className={event.time?.startsWith("今天") ? "font-semibold" : ""}>
              {formatTimeRange(event.startTime, event.durationMinutes)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span>
              剩余名额：
              <span className={event.spotsLeft <= 2 ? "font-semibold" : ""}>
                {event.spotsLeft === 0 ? "已满" : `${event.spotsLeft}人`}
              </span>
            </span>
          </div>
        </div>

        {/* 主办人 + 按钮 */}
        <div className="flex justify-between items-center pt-4 mt-2">
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
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (disabled) return;
              if (!event.userStatus || event.userStatus === "cancelled") {
                onJoinClick?.();
              } else if (event.userStatus === "pending") {
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
