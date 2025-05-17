"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserCount } from "@/lib/api";

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const { count } = await getUserCount();
        setUserCount(count);
      } catch (err) {
        console.error("获取用户数量失败", err);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 shadow-xl rounded-2xl w-full max-w-lg min-h-[700px] flex flex-col relative">
        {/* 顶部标题 */}
        <div className="text-center mb-6">
          <div className="h-6" />
          <h1 className="text-2xl font-bold text-gray-800">
            帮你找到真正的朋友
          </h1>
          <p className="text-sm text-gray-500 mt-2 italic tracking-wide">
            🧊 让我们一起击碎这个冷漠的世界
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center gap-5 h-full pt-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">🎉 信息提交成功！</h1>

          <p className="text-sm text-gray-700 leading-relaxed max-w-md">
            我们的团队正在审核你的申请。
            <br /><br />
            如果审核通过，你将成为
            <b>“早期核心共建者”</b>。
            共同见证并参与<b>一个全新真实社交系统</b>的诞生与成长。
            <br /><br />
            我们正在努力筛选有诚意、愿意参与的朋友，让你能遇到真正值得交往的朋友。
            <br /><br />
            请稍候……
          </p>

          <div className="mt-3 text-xs text-gray-500 italic">
            你不是一个人，目前已有{" "}
            <b>{userCount !== null ? userCount : "..."}</b>{" "}
            位志同道合的伙伴加入我们 🧡
          </div>

          <button
            onClick={() => router.push("/login")}
            className="mt-10 text-sm text-gray-500 hover:text-indigo-500 flex items-center gap-1 transition"
          >
            <LogOut className="w-4 h-4" />
            返回
          </button>
        </motion.div>
      </div>
    </div>
  );
}
