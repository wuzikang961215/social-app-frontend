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
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700"
      >
        <span>{title}</span>
        <span>{collapsed ? "▼" : "▲"}</span>
      </button>
      {!collapsed && <div className="divide-y">{children}</div>}
    </div>
  );
}
