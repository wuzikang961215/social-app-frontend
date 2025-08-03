"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";
import { checkEmailExists } from "@/lib/api"; // ✅ 改成引入封装的函数

export default function StepEmail({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = async () => {
    if (!formData.email?.trim()) {
      onError?.("email", "邮箱不能为空");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      onError?.("email", "邮箱格式不正确");
      return;
    }

    // ✅ 检查邮箱是否重复
    try {
      const res = await checkEmailExists(formData.email);
      if (res.data.exists) {
        onError?.("email", "该邮箱已被使用");
        return;
      }
    } catch (err) {
      console.error("检查邮箱失败", err);
      onError?.("email", "网络错误，请稍后再试");
      return;
    }

    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-1.5 text-center">
      <label className="block font-medium text-gray-700 text-sm">
        你的邮箱地址是什么？
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => {
            setFormData({ email: e.target.value });
            onError?.("email", ""); // ✅ 清除错误提示
          }}          
        placeholder="例如：your@email.com"
        className="w-full max-w-[220px] px-3 py-1.5 text-sm rounded-lg bg-gray-100 shadow-inner text-center"
      />
      {errors?.email && (
        <p className="text-xs text-orange-500 mt-1 italic tracking-wide">
          {errors.email}
        </p>
      )}
      <button onClick={handleNext}>
        <ArrowRightCircle className="w-6 h-6 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
