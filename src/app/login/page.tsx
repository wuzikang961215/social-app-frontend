"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("请填写所有字段");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("登录成功！");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "登录失败");
      } else {
        toast.error("登录失败");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-sm">

        {/* 顶部 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-600">欢迎回来！</h1>
          <p className="text-sm text-gray-500 mt-1">让认真交朋友的人相遇</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱"
            className="w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="密码"
            className="w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {/* 忘记密码 */}
          <div className="text-xs text-gray-500 text-right">
            <span
              onClick={() => router.push("/forgot-password")}
              className="hover:text-indigo-600 cursor-pointer hover:underline"
            >
              忘记密码？
            </span>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-6">
            <button 
              type="submit"
              disabled={loading}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
              )}
            </button>
          </div>
        </form>

        {/* 注册提示 */}
        <p className="text-center text-sm text-gray-500 mt-4 font-semibold tracking-wide">
          第一次来？
          <span
            onClick={() => router.push("/register")}
            className="text-gray-800 font-medium hover:underline cursor-pointer ml-1"
          >
            加入我们
          </span>
        </p>

      </div>
    </div>
  );
}
