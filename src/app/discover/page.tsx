"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface ExternalEvent {
  id: string;
  title: string;
  titleTranslated?: string;
  description: string;
  descriptionTranslated?: string;
  time: Date;
  timeFormatted: string;
  location: string;
  link: string;
}

const formatEventTime = (eventTime: Date) => {
  const date = new Date(eventTime);
  const now = new Date();
  
  // Get date only for comparison
  const eventDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDiff = Math.floor((eventDateOnly.getTime() - nowDateOnly.getTime()) / 86400000);
  
  // Chinese weekday names
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  
  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  // Format date
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const fullDate = `${month}月${day}日`;
  
  // Determine date prefix
  let datePrefix;
  if (dayDiff === 0) {
    datePrefix = "今天";
  } else if (dayDiff === 1) {
    datePrefix = "明天";
  } else if (dayDiff === 2) {
    datePrefix = "后天";
  } else if (dayDiff >= 3 && dayDiff <= 6) {
    // Within a week, show weekday + date
    datePrefix = `${weekday} ${fullDate}`;
  } else {
    // More than a week, show date
    datePrefix = fullDate;
  }
  
  return `${datePrefix} ${timeStr}`;
};

export default function EventsPage() {
  const [events, setEvents] = useState<ExternalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const response = await api.externalEvents.getEvents();
      // Backend now filters expired events
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">发现</h1>
              <p className="text-xs text-gray-500 mt-0.5">探索悉尼正在发生什么</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">由Yodda推荐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="p-3">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            暂无推荐内容
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {events.map((event, index) => (
              <div
                key={event.id || `event-${index}`}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  index % 3 === 0 ? "col-span-2" : ""
                }`}
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-sm text-gray-800 line-clamp-2">
                    {event.titleTranslated || event.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {event.descriptionTranslated || event.description}
                  </p>
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-start gap-1.5">
                      <Clock size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className={formatEventTime(new Date(event.time)).startsWith("今天") ? "font-semibold text-gray-900" : "text-gray-700"}>
                        {formatEventTime(new Date(event.time))}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 truncate">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <button
                      onClick={() => window.open(event.link, '_blank', 'noopener,noreferrer')}
                      className="w-full py-2 text-center text-xs text-indigo-600 font-medium"
                    >
                      查看详情 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}