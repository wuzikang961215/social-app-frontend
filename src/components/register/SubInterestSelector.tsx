"use client";
import { memo, useCallback } from 'react';
import { X } from "lucide-react";

interface Props {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}

const SubInterestSelector = memo(function SubInterestSelector({ options, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {options.map((item) => {
        const isSelected = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`relative px-2.5 py-[6px] text-xs border rounded-full transition-all
              ${
                isSelected
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {item}
            {isSelected && (
              <X
                className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-white bg-gray-600 rounded-full p-[1px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(item);
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});

export default SubInterestSelector;
