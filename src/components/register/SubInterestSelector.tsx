"use client";
import { X } from "lucide-react";

interface Props {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}

export default function SubInterestSelector({ options, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {options.map((item) => {
        const isSelected = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`relative px-3 py-2 text-sm border rounded-full transition-all
              ${
                isSelected
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {item}
            {isSelected && (
              <X
                className="absolute -top-2 -right-2 w-4 h-4 text-white bg-gray-600 rounded-full p-0.5"
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
}
