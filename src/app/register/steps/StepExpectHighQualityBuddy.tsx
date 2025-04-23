"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";

export default function StepExpectHighQualityBuddy({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleSelect = (choice: string) => {
    setFormData({ expectingHighQualityBuddy: choice });
    onError?.("expectingHighQualityBuddy", "");
  };

  const handleNext = () => {
    if (!formData.expectingHighQualityBuddy) {
      onError?.("expectingHighQualityBuddy", "请选择一个选项");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
      <label className="font-medium text-gray-700">你希望找到高质量搭子吗？</label>
      
      <ToggleButtonGroup
        options={["是", "否"]}
        value={formData.expectingHighQualityBuddy}
        onChange={(val) => {
          setFormData({ expectingHighQualityBuddy: val });
          onError?.("expectingHighQualityBuddy", "");
        }}
      />

      {errors?.expectingHighQualityBuddy && (
        <p className="text-sm text-orange-500 mt-1">{errors.expectingHighQualityBuddy}</p>
      )}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
