"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

export default function StepEventExpectation({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.expectEvent?.trim()) {
      onError?.("expectEvent", "不能为空");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center gap-1.5 px-4">
      {/* 主标题 */}
      <label className="block font-medium text-gray-700 text-sm">
        你对 Yodda 活动有什么期待？
      </label>

      {/* 输入区 */}
      <input
        type="text"
        value={formData.expectEvent}
        onChange={(e) => {
          setFormData({ expectEvent: e.target.value });
          onError?.("expectEvent", "");
        }}
        placeholder="比如：多一些 KTV、徒步活动"
        className="w-full max-w-[200px] px-3 py-1.5 text-sm rounded-lg bg-gray-100 shadow-inner text-center"
      />
      {errors?.expectEvent && (
        <p className="text-xs text-orange-500 mt-1 italic tracking-wide">
          {errors.expectEvent}
        </p>
      )}

      {/* 按钮 */}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-6 h-6 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
