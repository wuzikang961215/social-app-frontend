"use client";
import { Plus } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onAdd: (val: string) => void;
  disabledAdd: boolean;
  error?: string;
}

export default function CustomInterestInput({
  value,
  onChange,
  onAdd,
  disabledAdd,
  error,
}: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 w-[180px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="请输入兴趣"
          className="flex-1 px-2 py-1 text-xs border rounded-md bg-gray-100 text-center shadow-inner"
        />
        <button
          onClick={() => onAdd(value.trim())}
          disabled={disabledAdd}
          className={`p-1 rounded-full border transition ${
            disabledAdd
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      {error && <p className="text-xs text-orange-500 italic">{error}</p>}
    </div>
  );
}
