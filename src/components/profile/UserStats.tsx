"use client";

import { Calendar, Users } from "lucide-react";

interface UserStatsProps {
  stats: {
    createdCount: number;
    participatedCount: number;
    checkedInCount: number;
    noShowCount: number;
    attendanceRate: number;
  };
}

export default function UserStats({ stats }: UserStatsProps) {
  const { createdCount, participatedCount, checkedInCount, noShowCount, attendanceRate } = stats;

  return (
    <div className="space-y-2">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Created Events */}
        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Calendar size={16} className="text-indigo-500" />
            <span className="text-[11px] text-gray-600">发起活动</span>
          </div>
          <div className="text-lg font-bold text-gray-800">{createdCount} 场</div>
        </div>

        {/* Participated Events */}
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Users size={16} className="text-purple-500" />
            <span className="text-[11px] text-gray-600">参与活动</span>
          </div>
          <div className="text-lg font-bold text-gray-800">{participatedCount} 场</div>
        </div>
      </div>

      {/* Attendance Rate */}
      {participatedCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-600 font-medium">到场率</span>
            <span className={`text-[13px] font-bold px-2 py-1 rounded-full ${
              attendanceRate >= 90 ? "text-green-700 bg-green-100" :
              attendanceRate >= 70 ? "text-yellow-700 bg-yellow-100" : 
              "text-red-700 bg-red-100"
            }`}>
              {attendanceRate}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
            <div 
              className={`h-1.5 rounded-full transition-all duration-700 ${
                attendanceRate >= 90 ? "bg-green-500" :
                attendanceRate >= 70 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${attendanceRate}%` }}
            />
          </div>

          {/* Details */}
          <div className="flex justify-between text-[10px]">
            <span className="text-green-600">已签到: {checkedInCount}</span>
            <span className="text-red-600">未到场: {noShowCount}</span>
          </div>
        </div>
      )}

    </div>
  );
}