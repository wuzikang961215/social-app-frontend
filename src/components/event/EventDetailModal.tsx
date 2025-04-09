"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type EventDetailModalProps = {
  open: boolean;
  onClose: () => void;
  event: { id: string };
};

export default function EventDetailModal({ open, onClose, event }: EventDetailModalProps) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open && event.id) {
      setData(null); // 先清空旧内容
      fetch(`http://localhost:3002/api/events/${event.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })
        .then((res) => res.json())
        .then((resData) => setData(resData))
        .catch((err) => console.error("获取活动详情失败：", err));
    }
  }, [open, event.id]);

  return (
    <AnimatePresence>
      {open && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩带淡入 */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 卡片内容区域 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 space-y-4 z-10"
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 内容 */}
            <h2 className="text-lg font-semibold text-gray-800">{data.title}</h2>

            <div className="text-sm text-gray-600 space-y-2">
              <p><b>时间：</b>{data.time}</p>
              <p><b>地点：</b>{data.location}</p>
              <p><b>分类：</b>{data.category}</p>
              <p><b>剩余名额：</b>{data.spotsLeft} 人</p>
              <p><b>人数上限：</b>{data.maxParticipants} 人</p>
              <p><b>已报名人数：</b>{data.participants?.length || 0} 人</p>
              <p><b>标签：</b>{data.tags?.join(" / ") || "无"}</p>
              <p><b>主办人：</b>{data.organizer?.name || "未知"}</p>
              {data.description && (
                <p className="pt-2 whitespace-pre-wrap">
                  <b>介绍：</b>{data.description}
                </p>
              )}
              <p><b>是否过期：</b>{data.expired ? "已过期" : "进行中"}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
