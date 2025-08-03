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
      <div className="bg-white p-6 shadow-xl rounded-xl w-full max-w-lg min-h-[450px] flex flex-col relative">
        {/* 顶部标题 */}
        <div className="text-center mb-4">
          <div className="h-4" />
          <h1 className="text-lg font-bold text-gray-800">
            让认真交朋友的人相遇
          </h1>
          <p className="text-xs text-gray-500 mt-1 italic tracking-wide">
            从兴趣出发，找到与你合拍的人
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center gap-3 h-full pt-4"
        >
          <h1 className="text-lg font-bold text-gray-800">欢迎加入 Yodda</h1>

          <p className="text-xs text-gray-700 leading-relaxed max-w-md">
            你的注册信息已成功提交。
            <br /><br />
            我们正在持续优化使用体验，让每一次连接都更真实、更轻松。
            <br /><br />
            感谢你愿意认真交朋友。
          </p>

          <div className="mt-3 text-xs text-gray-500 italic">
            当前已有{" "}
            <b>{userCount !== null ? userCount : "..."}</b>{" "}
            位用户加入我们
          </div>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 text-xs text-gray-500 hover:text-indigo-500 flex items-center gap-1 transition"
          >
            <LogOut className="w-4 h-4" />
            去登录
          </button>
        </motion.div>
      </div>
    </div>
  );
}
