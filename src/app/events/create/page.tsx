"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/lib/api"; // ✅ 添加
import CreatorDisclaimerModal from "@/components/CreatorDisclaimerModal";

export default function CreateEvent() {
  const router = useRouter();
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "请输入活动名称";
    }
    if (!formData.location.trim()) {
      newErrors.location = "请输入活动地点";
    }
    if (!formData.startTime) {
      newErrors.startTime = "请选择开始时间";
    }
    if (!formData.category) {
      newErrors.category = "请选择活动分类";
    }
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = "参与人数至少为1人";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    // Show disclaimer modal if validation passes
    setShowDisclaimerModal(true);
  };

  const handleCreateEvent = async () => {
    try {
      // Keep the local time string as-is (YYYY-MM-DDTHH:mm format)
      // This preserves the exact time the organizer entered
      await createEvent({
        ...formData,
        startTime: formData.startTime, // Send as local time string
        maxParticipants: parseInt(formData.maxParticipants),
        durationMinutes: parseInt(formData.durationMinutes),
      });
  
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message || "创建失败，请重试");
      } else {
        alert("创建失败，请重试");
      }
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
          🎯 发个邀约
        </h2>

        {/* 活动名 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">想干啥？</div>
        <input
          placeholder="如：密室逃脱 / 排球social / KTV"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (errors.title) setErrors({ ...errors, title: "" });
          }}
          className={`w-full mb-1 px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm ${
            errors.title ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.title && <p className="text-xs text-red-500 mb-3">{errors.title}</p>}

        {/* 活动地点 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">在哪儿见？</div>
        <input
          placeholder="如：BE Escape Room, 746-748 George St, Haymarket NSW 2000"
          value={formData.location}
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
            if (errors.location) setErrors({ ...errors, location: "" });
          }}
          className={`w-full mb-1 px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm ${
            errors.location ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.location && <p className="text-xs text-red-500 mb-3">{errors.location}</p>}

        {/* 开始时间 */}
        <div className="text-sm font-semibold text-gray-700 mb-2">什么时候？</div>
        <input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => {
            setFormData({ ...formData, startTime: e.target.value });
            if (errors.startTime) setErrors({ ...errors, startTime: "" });
          }}
          className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm mb-1 ${
            errors.startTime ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.startTime && <p className="text-xs text-red-500 mb-3">{errors.startTime}</p>}

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
          {errors.category && <p className="text-xs text-red-500 mb-2">{errors.category}</p>}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFormData({ ...formData, category: cat });
                  if (errors.category) setErrors({ ...errors, category: "" });
                }}
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
            想找几个人？
          </label>
          <input
            type="number"
            min={1}
            placeholder="如：6"
            value={formData.maxParticipants}
            onChange={(e) => {
              setFormData({ ...formData, maxParticipants: e.target.value });
              if (errors.maxParticipants) setErrors({ ...errors, maxParticipants: "" });
            }}
            className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm ${
              errors.maxParticipants ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.maxParticipants && <p className="text-xs text-red-500 mt-1">{errors.maxParticipants}</p>}
        </div>

        {/* 活动描述 */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            跟大家说说这个活动（可选）
          </label>
          <textarea
            rows={3}
            placeholder="活动形式？节奏？需要提前准备什么？"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            className={`w-full px-4 py-2 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none ${
              errors.description ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full transition text-sm font-semibold"
        >
          发布邀约 🚀
        </button>
      </div>
      
      <CreatorDisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
        onAgree={() => {
          setShowDisclaimerModal(false);
          handleCreateEvent();
        }}
      />
    </div>
  );
}
