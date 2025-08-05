"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Save, X, Calendar, MapPin, Link, Globe } from "lucide-react";

interface ExternalEvent {
  id?: string;
  _id?: string;
  title: string;
  titleTranslated?: string;
  description: string;
  descriptionTranslated?: string;
  time: string;
  location: string;
  link: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<ExternalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExternalEvent>({
    title: "",
    description: "",
    time: "",
    location: "",
    link: ""
  });

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    // Replace with your admin user ID
    if (user.id !== "67ece9e577fb0dd27c504083") {
      toast.error("无权访问此页面");
      router.push("/");
      return;
    }
  }, [user, router]);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await api.externalEvents.getEvents();
      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add new event
  const handleAdd = async () => {
    if (!formData.title || !formData.description || !formData.time || !formData.location || !formData.link) {
      toast.error("请填写所有必填字段");
      return;
    }

    try {
      await api.externalEvents.create(formData);
      toast.success("内容添加成功");
      setFormData({ title: "", description: "", time: "", location: "", link: "" });
      fetchEvents();
    } catch (error) {
      toast.error("添加失败");
    }
  };

  // Update event
  const handleUpdate = async (id: string) => {
    const event = events.find(e => (e.id || e._id) === id);
    if (!event) {
      console.error("Event not found:", id);
      return;
    }

    try {
      // Only send the fields that backend expects
      const updateData = {
        title: event.title,
        description: event.description,
        time: event.time,
        location: event.location,
        link: event.link
      };
      
      console.log("Updating event:", id, updateData);
      await api.externalEvents.update(id, updateData);
      toast.success("更新成功");
      setEditingId(null);
      fetchEvents();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("更新失败");
    }
  };

  // Delete event
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条内容吗？")) return;

    try {
      await api.externalEvents.delete(id);
      toast.success("删除成功");
      fetchEvents();
    } catch (error) {
      toast.error("删除失败");
    }
  };

  if (!user || user.id !== "67ece9e577fb0dd27c504083") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">内容管理</h1>
          <p className="text-xs text-gray-500 mt-1">管理"悉尼正在发生"推荐内容</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Add New Event Form */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-bold text-sm mb-3">添加推荐内容</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600">标题 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="悉尼歌剧院音乐会"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-600">描述 *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="活动描述，可以用中文或英文"
                rows={3}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-600">时间 *</label>
              <input
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-600">地点 *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Sydney Opera House"
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-600">链接 *</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://www.sydneyoperahouse.com/events/..."
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleAdd}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              添加内容
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="font-bold text-sm p-4 border-b">内容列表</h2>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              暂无内容
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event, index) => {
                const eventId = event.id || event._id || '';
                const isEditing = editingId && String(editingId) === String(eventId);
                return (
                <div key={eventId || `event-${index}`} className="p-4">
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => setEvents(events.map(ev => 
                          (ev.id || ev._id) === eventId ? { ...ev, title: e.target.value } : ev
                        ))}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="标题"
                      />
                      <textarea
                        value={event.description}
                        onChange={(e) => setEvents(events.map(ev => 
                          (ev.id || ev._id) === eventId ? { ...ev, description: e.target.value } : ev
                        ))}
                        rows={2}
                        className="w-full px-2 py-1 border rounded text-sm resize-none"
                        placeholder="描述"
                      />
                      <input
                        type="datetime-local"
                        value={event.time.includes('T') ? event.time.slice(0, 16) : new Date(event.time).toISOString().slice(0, 16)}
                        onChange={(e) => setEvents(events.map(ev => 
                          (ev.id || ev._id) === eventId ? { ...ev, time: e.target.value } : ev
                        ))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="text"
                        value={event.location}
                        onChange={(e) => setEvents(events.map(ev => 
                          (ev.id || ev._id) === eventId ? { ...ev, location: e.target.value } : ev
                        ))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <input
                        type="url"
                        value={event.link}
                        onChange={(e) => setEvents(events.map(ev => 
                          (ev.id || ev._id) === eventId ? { ...ev, link: e.target.value } : ev
                        ))}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(eventId)}
                          className="flex-1 bg-green-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Save size={14} />
                          保存
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gray-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <X size={14} />
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <h3 className="font-bold text-sm">{event.title}</h3>
                      {event.titleTranslated && event.titleTranslated !== event.title && (
                        <p className="text-xs text-gray-500 italic">译: {event.titleTranslated}</p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      {event.descriptionTranslated && event.descriptionTranslated !== event.description && (
                        <p className="text-xs text-gray-500 italic">译: {event.descriptionTranslated}</p>
                      )}
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(event.time).toLocaleString('zh-CN')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link size={12} />
                          <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate">
                            {event.link}
                          </a>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setEditingId(eventId)}
                          className="flex-1 bg-blue-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Edit size={14} />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(eventId)}
                          className="flex-1 bg-red-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} />
                          删除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}