// app/register/steps/StepWelcome.tsx
"use client";
import { StepProps } from "../page";

export default function StepWelcome({ onNext }: StepProps) {
  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center gap-1.5 px-4 select-none" onClick={onNext}>
      <p className="text-sm font-medium text-gray-700">
        欢迎来到Yodda真实社交平台
      </p>
      <p className="text-xs text-gray-500 italic tracking-wide">
        点击继续
      </p>
    </div>
  );
}
