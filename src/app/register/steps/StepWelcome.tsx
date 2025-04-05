// app/register/steps/StepWelcome.tsx
"use client";
import { StepProps } from "../page";

export default function StepWelcome({ onNext }: StepProps) {
  return (
    <div
      className="text-center cursor-pointer select-none"
      onClick={onNext}
    >
      <p className="text-lg font-medium text-gray-700">
        欢迎来到我们的小圈子 🫶
      </p>
    </div>
  );
}
