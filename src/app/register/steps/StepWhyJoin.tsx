// app/register/steps/StepWhyJoin.tsx
"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

export default function StepWhyJoin({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.whyJoin?.trim()) {
      onError?.("whyJoin", "不能为空");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center gap-1.5 px-4">
      <label className="block font-medium text-gray-700 text-sm">
        你为什么想要加入我们？
      </label>

      <input
        type="text"
        value={formData.whyJoin}
        onChange={(e) => {
          setFormData({ whyJoin: e.target.value });
          onError?.("whyJoin", "");
        }}
        placeholder="比如：在澳洲太无聊了"
        className="w-full max-w-[200px] px-3 py-1.5 text-sm rounded-lg bg-gray-100 shadow-inner text-center"
      />
      {errors?.whyJoin && (
        <p className="text-xs text-orange-500 mt-1 italic tracking-wide">{errors.whyJoin}</p>
      )}

      <button onClick={handleNext}>
        <ArrowRightCircle className="w-6 h-6 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
