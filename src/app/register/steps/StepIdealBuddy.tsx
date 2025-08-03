// app/register/steps/StepIdealBuddy.tsx
"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

export default function StepIdealBuddy({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.idealBuddy?.trim()) {
      onError?.("idealBuddy", "不能为空");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center gap-1.5 px-4">
      <label className="block font-medium text-gray-700 text-sm">
        你理想的搭子/朋友是什么样的？
      </label>

      <input
        type="text"
        value={formData.idealBuddy}
        onChange={(e) => {
          setFormData({ idealBuddy: e.target.value });
          onError?.("idealBuddy", "");
        }}
        placeholder="比如：愿意主动约我"
        className="w-full max-w-[200px] px-3 py-1.5 text-sm rounded-lg bg-gray-100 shadow-inner text-center"
      />
      {errors?.idealBuddy && (
        <p className="text-xs text-orange-500 mt-1 italic tracking-wide">{errors.idealBuddy}</p>
      )}

      <button onClick={handleNext}>
        <ArrowRightCircle className="w-6 h-6 text-indigo-500 hover:scale-110 transition"/>
      </button>
    </div>
  );
}