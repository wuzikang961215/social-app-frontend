"use client";
import React from "react";

interface ToggleButtonGroupProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export default function ToggleButtonGroup({
  options,
  value,
  onChange,
  className = "",
}: ToggleButtonGroupProps) {
  return (
    <div
      className={`flex w-50 max-w-xs border rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      {options.map((opt, index) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-1/2 py-2 text-sm font-medium transition-all
            ${
              value === opt
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }
            ${index === 0 ? "rounded-l-lg" : ""}
            ${index === options.length - 1 ? "rounded-r-lg" : ""}
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
