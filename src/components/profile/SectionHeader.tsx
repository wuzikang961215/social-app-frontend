import React from "react";

export default function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3 border-b pb-1 border-gray-200">
      {icon}
      {title}
    </div>
  );
}
