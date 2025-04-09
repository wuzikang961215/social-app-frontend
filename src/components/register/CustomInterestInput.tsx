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
      <div className="flex items-center gap-2 w-[200px]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="请输入你的兴趣"
          className="flex-1 px-4 py-2 border rounded-lg bg-gray-100 text-center shadow-inner"
        />
        <button
          onClick={() => onAdd(value.trim())}
          disabled={disabledAdd}
          className={`p-2 rounded-full border transition ${
            disabledAdd
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-500 text-white hover:bg-indigo-600"
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-sm text-orange-500 italic">{error}</p>}
    </div>
  );
}
