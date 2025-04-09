"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

export default function StepPassword({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.password?.trim()) {
      onError?.("password", "密码不能为空");
      return;
    }
    if (formData.password.length < 6) {
      onError?.("password", "密码至少6位");
      return;
    }
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-2 text-center">
      <label className="block font-medium text-gray-700 text-m">
        设置一个密码
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={(e) => {
            setFormData({ password: e.target.value });
            onError?.("password", ""); // ✅ 清除错误提示
          }}     
        placeholder="密码不少于6位"
        className="w-55 px-4 py-2 rounded-xl bg-gray-100 shadow-inner text-center"
      />
      {errors?.password && (
        <p className="text-sm text-orange-500 mt-2 italic tracking-wide">
          {errors.password}
        </p>
      )}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
