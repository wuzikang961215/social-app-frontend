import React from "react";

export default function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[15px] font-bold text-gray-800 pb-2.5 border-b-2 border-gray-200">
      {icon}
      {title}
    </div>
  );
}
