"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Users, HeartHandshake, BadgeCheck, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserById, api } from "@/lib/api";
import { getMBTIDisplay } from "@/lib/mbtiConstants";

interface UserDetailPopoverProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  anchorEl: HTMLElement | null;
}

export default function UserDetailPopover({
  open,
  onClose,
  userId,
  username,
  anchorEl,
}: UserDetailPopoverProps) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on anchor element
  useEffect(() => {
    if (anchorEl && popoverRef.current && open) {
      const rect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      
      // Position to the right of the element by default
      let left = rect.right + 10;
      let top = rect.top;
      
      // Check if it would overflow the right edge
      if (left + popoverRect.width > window.innerWidth) {
        // Position to the left instead
        left = rect.left - popoverRect.width - 10;
      }
      
      // Check if it would overflow the bottom
      if (top + popoverRect.height > window.innerHeight) {
        // Adjust to fit on screen
        top = window.innerHeight - popoverRect.height - 10;
      }
      
      // Ensure minimum margins
      top = Math.max(10, top);
      left = Math.max(10, left);
      
      setPosition({ top, left });
    }
  }, [anchorEl, userInfo, userStats, open]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          anchorEl && !anchorEl.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  useEffect(() => {
    if (open && userId) {
      setLoading(true);
      Promise.all([
        getUserById(userId),
        api.user.getStats(userId)
      ])
        .then(([userRes, statsRes]) => {
          setUserInfo(userRes);
          setUserStats(statsRes);
        })
        .catch(err => console.error('Failed to fetch user details:', err))
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[70] bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80"
          style={{ 
            top: position.top + 'px', 
            left: position.left + 'px',
            position: 'fixed'
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {username[0]?.toUpperCase()}
                </div>
                <h3 className="font-semibold text-gray-800">{username}</h3>
              </div>

              {/* Stats */}
              {userStats && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Calendar size={12} className="text-indigo-500" />
                      <span className="text-xs text-gray-600">发起活动</span>
                    </div>
                    <div className="text-base font-bold text-gray-800">{userStats.createdCount} 场</div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Users size={12} className="text-purple-500" />
                      <span className="text-xs text-gray-600">参与活动</span>
                    </div>
                    <div className="text-base font-bold text-gray-800">{userStats.participatedCount} 场</div>
                  </div>
                </div>
              )}

              {/* Attendance Rate */}
              {userStats && userStats.participatedCount > 0 && (
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">到场率</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                      userStats.attendanceRate >= 90 ? "text-green-700 bg-green-100" :
                      userStats.attendanceRate >= 70 ? "text-yellow-700 bg-yellow-100" : 
                      "text-red-700 bg-red-100"
                    }`}>
                      {userStats.attendanceRate}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        userStats.attendanceRate >= 90 ? "bg-green-500" :
                        userStats.attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${userStats.attendanceRate}%` }}
                    />
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-1.5">
                  <Brain size={12} className="text-purple-400 mt-0.5" />
                  <div>
                    <span className="text-gray-500">MBTI:</span>
                    <span className="text-gray-700 ml-1">{getMBTIDisplay(userInfo?.mbti)}</span>
                  </div>
                </div>

                {userInfo?.idealBuddy && (
                  <div className="flex items-start gap-1.5">
                    <HeartHandshake size={12} className="text-indigo-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500">想遇见:</span>
                      <span className="text-gray-700 ml-1">&ldquo;{userInfo.idealBuddy}&rdquo;</span>
                    </div>
                  </div>
                )}

                {userInfo?.interests?.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <BadgeCheck size={12} className="text-green-400 mt-0.5" />
                    <div>
                      <span className="text-gray-500">爱好:</span>
                      <span className="text-gray-700 ml-1">{userInfo.interests.join('、')}</span>
                    </div>
                  </div>
                )}

                {userInfo?.whyJoin && (
                  <div className="bg-gray-50 rounded-lg p-2 mt-1">
                    <p className="text-xs text-gray-700 italic leading-relaxed">&ldquo;{userInfo.whyJoin}&rdquo;</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}