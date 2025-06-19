"use client";
import { useState } from "react";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

export default function StepPassword({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    const password = formData.password?.trim() || "";
    const confirm = confirmPassword.trim();

    if (!password) {
      onError?.("password", "密码不能为空");
      return;
    }
    if (password.length < 6) {
      onError?.("password", "密码至少6位");
      return;
    }
    if (confirm !== password) {
      onError?.("confirmPassword", "两次密码不一致");
      return;
    }

    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-2 text-center px-4">
      <label className="block font-medium text-gray-700 text-sm">
        设置一个密码
      </label>

      {/* 密码输入 */}
      <input
        type="password"
        name="password"
        value={formData.password || ""}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
          onError?.("password", "");
        }}
        placeholder="密码不少于6位"
        className="w-full max-w-[220px] px-4 py-1.5 rounded-xl bg-gray-100 shadow-inner text-center text-sm"
      />
      {errors?.password && (
        <p className="text-xs text-orange-500 italic tracking-wide">
          {errors.password}
        </p>
      )}

      <label className="block font-medium text-gray-700 text-sm mt-2">
        确认密码
      </label>

      {/* 确认密码输入 */}
      <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          onError?.("confirmPassword", "");
        }}
        placeholder="再次输入密码"
        className="w-full max-w-[220px] px-4 py-1.5 rounded-xl bg-gray-100 shadow-inner text-center text-sm"
      />
      {errors?.confirmPassword && (
        <p className="text-xs text-orange-500 italic tracking-wide">
          {errors.confirmPassword}
        </p>
      )}

      <button onClick={handleNext} className="mt-2">
        <ArrowRightCircle className="w-7 h-7 text-indigo-500 hover:scale-110 transition" />
      </button>
    </div>
  );
}
