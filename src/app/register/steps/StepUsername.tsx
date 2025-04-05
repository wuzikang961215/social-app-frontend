// app/register/steps/StepUsername.tsx
"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

export default function StepUsername({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.username?.trim()) {
      onError?.("username", "用户名不能为空");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-2 text-center">
      <label className="block font-medium text-gray-700 text-m">
        设置一个用户名
      </label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={(e) => setFormData({ username: e.target.value })}
        placeholder="比如：peterWu"
        className="w-55 px-4 py-2 rounded-xl bg-gray-100 shadow-inner text-center"
      />
      {errors?.username && (
        <p className="text-sm text-orange-500 mt-2 italic tracking-wide">
          {errors.username}
        </p>
      )}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-8 h-8 text-gray-600 hover:text-black hover:scale-110 transition mt-2" />
      </button>
    </div>
  );
}
