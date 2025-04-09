"use client";
interface Props {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
}

export default function MainInterestSelector({ options, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition
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
