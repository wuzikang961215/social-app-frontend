"use client";
import { X } from "lucide-react";

interface Props {
  items: string[];
  onRemove: (val: string) => void;
}

export default function SelectedTags({ items, onRemove }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2 text-xs text-gray-600">
      已选兴趣（{items.length} / 7）:
      <div className="flex flex-wrap justify-center mt-1 gap-1.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-full px-2 py-[3px] text-xs"
          >
            {item}
            <X
              className="w-3.5 h-3.5 text-gray-500 cursor-pointer hover:text-black"
              onClick={() => onRemove(item)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
