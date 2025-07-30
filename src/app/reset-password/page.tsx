"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightCircle, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("无效的重置链接");
      router.push("/login");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("请填写所有字段");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("密码长度至少为6位");
      return;
    }

    if (!token) {
      toast.error("无效的重置链接");
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.resetPassword(token, newPassword);
      toast.success(response.data.message);
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "密码重置失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-sm">
        {/* 顶部 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-600">设置新密码</h1>
          <p className="text-sm text-gray-500 mt-1">请输入您的新密码</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="新密码"
              className="w-full px-4 py-2 pr-10 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="确认新密码"
              className="w-full px-4 py-2 pr-10 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* 密码要求提示 */}
          <div className="text-xs text-gray-500">
            <p>密码要求：至少6个字符</p>
          </div>

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

        {/* 返回登录 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          记起密码了？
          <span
            onClick={() => router.push("/login")}
            className="text-gray-800 font-medium hover:underline cursor-pointer ml-1"
          >
            返回登录
          </span>
        </p>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}