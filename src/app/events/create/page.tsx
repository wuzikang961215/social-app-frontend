"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/api";

export default function CreateEvent() {
  const router = useRouter();

  const categories = [
    "运动与户外", "音乐与影视", "美食与社交",
    "旅行与摄影", "学习与职业", "其他",
  ];

  const tagList = [
    "社恐友好", "轻松向", "深度交流", "新手推荐", "快节奏", "烧脑",
    "欢乐游戏", "文艺气息", "喜欢摄影", "适合独行", "自由随性", "喜欢聊天",
    "需要配合", "动静结合", "适合情侣", "不需要准备", "可带朋友", "中文主导",
    "英语友好", "欢迎新人", "节奏舒缓", "脑力挑战",
  ];

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startTime: "",
    durationMinutes: "90",
    category: "",
    tags: [] as string[],
    maxParticipants: "",
    description: "",
  });

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async () => {
    try {
      const localTime = new Date(formData.startTime); // 👈 本地时间
      const isoTime = localTime.toISOString(); // 👈 转为 UTC ISO 字符串
  
      const res = await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          startTime: isoTime, // ✅ 替换成带时区的标准格式
          maxParticipants: parseInt(formData.maxParticipants),
          durationMinutes: parseInt(formData.durationMinutes),
        }),
      });
  
      if (!res.ok) throw new Error("创建失败");
      router.push("/");
    } catch (error) {
      alert("创建失败，请重试");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="relative bg-white border border-gray-30 w-full max-w-xl p-8 rounded-2xl shadow-xl">

        {/* 关闭按钮 */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          📝 创建新活动
        </h2>

        {/* 活动名 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">活动名</div>
        <input
          placeholder="如：密室逃脱 / 排球social / KTV"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full mb-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />

        {/* 活动地点 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">活动地点</div>
        <input
          placeholder="如：BE Escape Room, 746-748 George St, Haymarket NSW 2000"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full mb-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />

        {/* 开始时间 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">开始时间</div>
        <input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm mb-4"
        />

        {/* 活动时长 */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">活动时长</div>
          <div className="flex items-center">
            <input
              type="number"
              min={15}
              step={15}
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData({ ...formData, durationMinutes: e.target.value })
              }
              placeholder="活动时长"
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-200 rounded-r-xl text-sm text-gray-600">
              分钟
            </span>
          </div>
        </div>

        {/* 活动分类 */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">活动分类</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-4 py-1 rounded-full text-sm transition ${
                  formData.category === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">标签（可多选）</div>
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  formData.tags.includes(tag)
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 参与人数 */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            预计最多参与人数
          </label>
          <input
            type="number"
            min={1}
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
        </div>

        {/* 活动描述 */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            写点介绍，让别人了解你的活动
          </label>
          <textarea
            rows={3}
            placeholder="活动形式？节奏？需要提前准备什么？"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none"
          />
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full transition text-sm font-semibold"
        >
          创建活动
        </button>
      </div>
    </div>
  );
}
