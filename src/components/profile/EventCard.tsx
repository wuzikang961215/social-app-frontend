import { User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventCard({
  event,
  userStatus,
  showAction,
  actionLabel,
  onAction,
}: {
  event: any;
  userStatus?: string;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const isPast = event.expired;

  return (
    <div className="p-4 bg-white text-sm relative">
      <div className="font-bold text-gray-800">{event.title}</div>
      <div className="text-gray-500 italic">
        🕒 {event.startTime} ｜ 📍{event.location}
        {event.spotsLeft != null && !isPast && ` ｜ 剩余名额：${event.spotsLeft}人`}
      </div>

      {/* 主办人 */}
      {userStatus && (
        <div className="text-gray-700 space-y-1 mt-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 italic">
            <User size={14} className="text-gray-400" />
            主办人
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-gray-600 text-xs shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => console.log("点击了主办人 Harry")}
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              Harry
            </span>
          </div>
        </div>
      )}

      {/* 参与者 */}
      <div className="text-gray-700 space-y-1 mt-2">
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-1 mt-5 italic">
          <Users size={14} className="text-gray-400" />
          已加入（{event.participants.length}人）
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {event.participants.map((p: string) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-gray-600 text-xs shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => console.log(`点击了参与者 ${p}`)}
            >
              <User className="w-3.5 h-3.5 text-gray-400" />
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-end pt-4">
        {userStatus ? (
          <Button
            size="sm"
            className={`text-xs px-3 py-1 rounded-full ${
              userStatus === "approved"
                ? "bg-emerald-500 text-white"
                : userStatus === "checkedIn"
                ? "bg-emerald-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {userStatus === "approved"
              ? "已加入"
              : userStatus === "pending"
              ? "等待审核"
              : userStatus === "checkedIn"
              ? "已签到"
              : "未签到"}
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
