"use client";
import { StepProps } from "../page";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function StepPromote({
  formData,
}: StepProps) {
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await registerUser(formData);
      router.push("/register/success");
    } catch (err) {
      console.error("注册失败", err);
      alert("提交失败，请稍后再试");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md flex flex-col items-center text-center gap-6 px-4 pt-6 pb-10"
    >
      {/* 标题 */}
      <div className="text-xl font-semibold text-gray-800">
        一切准备就绪
      </div>

      {/* 正文 */}
      <div className="text-sm text-gray-700 leading-relaxed tracking-wide italic">
        我们正在构建一个真实连接的社交空间，<br />
        在这里，大家都在认真交朋友。<br />
        欢迎你成为其中的一员。
      </div>

      <p className="text-sm text-gray-500 mt-2 italic tracking-wide">
        （点击这里提交注册）
      </p>

      {/* 提交按钮 */}
      <button onClick={handleSubmit}>
        <CheckCircle className="w-8 h-8 text-green-500 hover:scale-110 transition mt-1" />
      </button>
    </motion.div>
  );
}
