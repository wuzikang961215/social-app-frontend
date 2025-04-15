import { User, HeartHandshake, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserInfoCard({ user }: { user: any }) {
  return (
    <div className="rounded-xl bg-white p-4 text-sm text-gray-700 space-y-2 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 font-semibold">
        <User size={18} className="text-gray-500" />
        {user.username}
        <span className="text-xs text-gray-500 ml-2">Lv.{user.level}</span>
      </div>
      <div className="flex items-start gap-2">
        <HeartHandshake size={16} className="text-indigo-400 mt-0.5" />
        <span>想遇见的朋友：“{user.idealBuddy || "未填写"}”</span>
      </div>
      <div className="flex items-start gap-2">
        <BadgeCheck size={16} className="text-green-400 mt-0.5" />
        <span>爱好：{user.hobbies?.join("、") || "未填写"}</span>
      </div>
      <p className="italic text-gray-500 text-sm">“{user.whyJoin || "TA 还没填写为什么想加入"}”</p>
      <div className="pt-2 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="text-xs px-3 py-1 rounded-full border-gray-300 text-gray-600 hover:bg-gray-100"
          onClick={() => alert("弹出修改资料 Modal（待实现）")}
        >
          ✏️ 修改资料
        </Button>
      </div>
    </div>
  );
}
