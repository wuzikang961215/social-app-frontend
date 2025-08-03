import React from "react";

export default function CollapsibleList({
  title,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-[13px] font-semibold text-gray-700 transition-colors"
      >
        <span>{title}</span>
        <span className="text-[11px]">{collapsed ? "▼" : "▲"}</span>
      </button>
      {!collapsed && <div className="divide-y divide-gray-100">{children}</div>}
    </div>
  );
}
