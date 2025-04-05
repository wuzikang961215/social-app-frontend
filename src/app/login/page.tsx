"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // 👈 切换登录/注册（暂时只用登录）
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3002/api/auth/login", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      router.push("/");
    } catch (error: any) {
      alert(error.response?.data?.message || "登录失败");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-full max-w-sm">

        {/* 顶部 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-600">欢迎回来！</h1>
          <p className="text-sm text-gray-500 mt-1">帮你找到真正的朋友</p>
        </div>

        {/* 登录表单 */}
        <div className="flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="邮箱"
            className="w-64 max-w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="密码"
            className="w-64 max-w-full px-4 py-2 rounded-xl bg-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button onClick={handleLogin}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
          </button>
        </div>

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
