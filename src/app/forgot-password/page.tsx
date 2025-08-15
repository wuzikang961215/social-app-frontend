"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircle, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("请输入邮箱");
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.requestPasswordReset(email);
      toast.success(response.message);
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "发送重置邮件失败");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">邮件已发送</h2>
            <p className="text-gray-600 text-sm">
              如果该邮箱已注册，您将收到密码重置链接。
              请检查您的邮箱并按照说明操作。
            </p>
          </div>
          
          <button
            onClick={() => router.push("/login")}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            返回登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-sm">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push("/login")}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span className="text-sm">返回</span>
        </button>

        {/* 顶部 */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-700">重置密码</h1>
          <p className="text-sm text-gray-500 mt-2">我们将向您的注册邮箱发送重置链接</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱地址"
            className="w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {/* 提交按钮 */}
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
      </div>
    </div>
  );
}