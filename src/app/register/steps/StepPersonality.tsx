"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";

export default function StepPersonality({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.personality) {
      onError?.("personality", "请选择一个选项");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
      <label className="block font-medium text-gray-700 text-base">
        你更偏向哪种性格？
      </label>

      <ToggleButtonGroup
        options={["内向", "外向"]}
        value={formData.personality}
        onChange={(val) => {
          setFormData({ personality: val });
          onError?.("personality", "");
        }}
      />

      {errors?.personality && (
        <p className="text-sm text-orange-500 mt-1 italic tracking-wide">
          {errors.personality}
        </p>
      )}

      <button onClick={handleNext}>
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
