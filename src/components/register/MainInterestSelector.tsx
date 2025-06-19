"use client";
interface Props {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}

export default function MainInterestSelector({ options, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`w-full min-h-[32px] rounded-md border text-xs font-medium text-center transition
            ${selected === opt
              ? "bg-indigo-500 text-white border-indigo-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
