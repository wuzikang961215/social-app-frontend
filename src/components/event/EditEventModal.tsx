import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { parseISO, format, addMinutes } from "date-fns";
import { X } from "lucide-react";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onEventUpdated: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onEventUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startTime: "",
    durationMinutes: "90",
    description: "",
    maxParticipants: 2,
    category: "",
    tags: [] as string[]
  });

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

  // Initialize form data when event changes
  useEffect(() => {
    if (event && event.startTime) {
      try {
        const startDate = parseISO(event.startTime);
        
        // Check if the date is valid
        if (isNaN(startDate.getTime())) {
          console.error('Invalid startTime:', event.startTime);
          return;
        }
        
        setFormData({
          title: event.title || "",
          location: event.location || "",
          startTime: format(startDate, "yyyy-MM-dd'T'HH:mm"),
          durationMinutes: String(event.durationMinutes || 90),
          description: event.description || "",
          maxParticipants: event.maxParticipants || 2,
          category: event.category || "",
          tags: event.tags || []
        });
      } catch (error) {
        console.error('Error parsing event data:', error);
      }
    }
  }, [event]);

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare update data
      const updateData = {
        title: formData.title,
        location: formData.location,
        startTime: formData.startTime,
        durationMinutes: parseInt(formData.durationMinutes),
        description: formData.description,
        maxParticipants: formData.maxParticipants,
        category: formData.category,
        tags: formData.tags
      };

      await api.events.update(event.id, updateData);
      onEventUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "更新活动失败");
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white border border-gray-200 w-full max-w-xl p-4 rounded-xl shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            {/* 标题和关闭按钮 */}
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
                ✏️ 编辑活动
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 -mt-1 -mr-1 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs mb-3">
                  {error}
                </div>
              )}

              {/* 活动名 */}
              <div className="text-xs font-semibold text-gray-700 mb-1.5">活动名</div>
              <input
                type="text"
                placeholder="如：密室逃脱 / 排球social / KTV"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full mb-3 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                required
                maxLength={50}
              />

              {/* 活动地点 */}
              <div className="text-xs font-semibold text-gray-700 mb-1.5">活动地点</div>
              <input
                type="text"
                placeholder="如：BE Escape Room, 746-748 George St, Haymarket NSW 2000"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full mb-3 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                required
                maxLength={100}
              />

              {/* 开始时间 */}
              <div className="text-xs font-semibold text-gray-700 mb-1.5">开始时间</div>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs mb-3"
                required
              />

              {/* 活动时长 */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 mb-1.5">活动时长</div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    placeholder="活动时长"
                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                  />
                  <span className="px-2.5 py-1.5 bg-gray-100 border border-l-0 border-gray-200 rounded-r-lg text-xs text-gray-600">
                    分钟
                  </span>
                </div>
              </div>

              {/* 活动分类 */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 mb-1.5">活动分类</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-0.5 rounded-full text-[10px] ${
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
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-700 mb-1.5">标签（可多选）</div>
                <div className="flex flex-wrap gap-1.5">
                  {tagList.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
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
              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  预计最多参与人数
                </label>
                <input
                  type="number"
                  min={2}
                  max={50}
                  value={formData.maxParticipants}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormData({ ...formData, maxParticipants: isNaN(value) ? 2 : value });
                  }}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                  required
                />
              </div>

              {/* 活动描述 */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  写点介绍，让别人了解你的活动
                </label>
                <textarea
                  rows={3}
                  placeholder="活动形式？节奏？需要提前准备什么？"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs resize-none"
                  maxLength={500}
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "更新中..." : "更新活动"}
              </button>
            </form>
      </div>
    </div>
  );
};

export default EditEventModal;