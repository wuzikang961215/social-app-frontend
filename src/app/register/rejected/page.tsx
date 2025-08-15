"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function RejectedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 shadow-xl rounded-xl w-full max-w-lg min-h-[450px] flex flex-col relative">

        {/* 🔒 右上角登出按钮 */}
        <LogOut
          onClick={() => {
            router.push("/login");
          }}
          className="absolute top-3 right-3 w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer hover:scale-110"
        />

        {/* 🧠 标题区，模拟主页面布局结构 */}
        <div className="text-center mb-4">
          <div className="h-4" /> {/* 占位，统一顶部留白高度 */}
          <h1 className="text-lg font-bold text-gray-800">
            帮你找到真正的朋友
          </h1>
          <p className="text-xs text-gray-500 mt-1 italic tracking-wide">
            🧊 让我们一起击碎这个冷漠的世界
          </p>
        </div>

        {/* 🌈 正文内容淡入动画 */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-grow flex flex-col justify-center items-center text-center px-6"
        >
          <h2 className="text-base font-semibold text-gray-800">
            🙁 你选择不参与我们的高质量小圈子
          </h2>

          <p className="text-xs mt-3 text-gray-600 leading-relaxed max-w-xs">
            我们理解，认真参与一个线下社群需要时间与精力。
            <br /><br />
            当你准备好真正交朋友、投入这个温暖的小圈子时，我们随时欢迎你回来 ❤️
            <br /><br />
            期待与你在线下见面！
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}
