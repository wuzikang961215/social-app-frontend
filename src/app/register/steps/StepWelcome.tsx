// app/register/steps/StepWelcome.tsx
"use client";
import { StepProps } from "../page";

export default function StepWelcome({ onNext }: StepProps) {
  return (
    <div className="text-center select-none" onClick={onNext}>
      <p className="text-lg font-medium text-gray-700">
        欢迎来到Yodda真实社交平台
      </p>
      <p className="text-sm text-gray-500 mt-2 italic tracking-wide">
        点击继续
      </p>
    </div>
  );
}
