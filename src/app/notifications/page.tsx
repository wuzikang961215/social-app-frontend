"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationsModal from "@/components/notification/NotificationsModal";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <h1 className="text-xl font-bold text-center">消息</h1>
      </div>
      
      <div className="px-4 py-2">
        <NotificationsModal
          open={true}
          onClose={() => {}} // We don't close since it's a page
          userId={user.id}
          embedMode={true} // Add this prop to hide modal chrome
        />
      </div>
    </div>
  );
}