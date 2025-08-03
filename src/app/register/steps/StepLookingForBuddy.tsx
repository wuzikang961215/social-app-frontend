"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";

export default function StepLookingForBuddy({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleSelect = (choice: string) => {
    setFormData({ lookingForBuddy: choice });
    onError?.("lookingForBuddy", "");
  };

  const handleNext = () => {
    if (!formData.lookingForBuddy) {
      onError?.("lookingForBuddy", "请选择一个选项");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-2 text-center">
      <label className="font-medium text-gray-700 text-sm">你注册本软件，是想要找搭子吗？</label>

      <ToggleButtonGroup
        options={["是", "否"]}
        value={formData.lookingForBuddy}
        onChange={handleSelect}
      />

      {errors?.lookingForBuddy && (
        <p className="text-xs text-orange-500 mt-1">{errors.lookingForBuddy}</p>
      )}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-6 h-6 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
