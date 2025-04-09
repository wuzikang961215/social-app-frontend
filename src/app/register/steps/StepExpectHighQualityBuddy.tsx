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
    setFormData({ expectHighQualityBuddy: choice });
    onError?.("expectHighQualityBuddy", "");
  };

  const handleNext = () => {
    if (!formData.expectHighQualityBuddy) {
      onError?.("expectHighQualityBuddy", "请选择一个选项");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
      <label className="font-medium text-gray-700">你希望找到高质量搭子吗？</label>
      
      <ToggleButtonGroup
        options={["是", "否"]}
        value={formData.expectHighQualityBuddy}
        onChange={(val) => {
          setFormData({ expectHighQualityBuddy: val });
          onError?.("expectHighQualityBuddy", "");
        }}
      />

      {errors?.expectHighQualityBuddy && (
        <p className="text-sm text-orange-500 mt-1">{errors.expectHighQualityBuddy}</p>
      )}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
