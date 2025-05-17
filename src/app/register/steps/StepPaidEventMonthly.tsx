"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepPaidEventMonthly({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps & { endFlow?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelect = (choice: string) => {
    setFormData({ paidEventMonthly: choice });
    onError?.("paidEventMonthly", "");
  };

  const handleNext = () => {
    if (!formData.paidEventMonthly) {
      onError?.("paidEventMonthly", "请选择一个选项");
      return;
    }

    if (formData.paidEventMonthly === "否") {
      onNext(); // ❌否的逻辑（后面再决定要不要跳 rejected）
    } else {
      onNext();
    }
  };

  const texts = [
    `没关系，我们知道每个人的时间都不一样～`,
    `那如果不是每两周一次，你觉得<b>每月至少参加一次</b>活动，保持一定熟悉感，OK 吗？`,
  ];

  return (
    <div
      className="w-full max-w-md h-[365px] flex flex-col justify-center items-center text-center px-4 pt-3 pb-6 gap-3"
      onClick={() => {
        if (currentStep <= texts.length) {
          setCurrentStep(currentStep + 1);
        }
      }}
    >
      <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed italic">
        {texts.slice(0, currentStep).map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.05 }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </div>

      {currentStep > texts.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 mt-3"
        >
          <div className="text-sm font-medium text-gray-800">
            你愿意每月至少参加一次这样的付费活动吗？
          </div>

          <ToggleButtonGroup
            options={["是", "否"]}
            value={formData.paidEventMonthly}
            onChange={handleSelect}
          />

          {errors?.paidEventMonthly && (
            <p className="text-sm text-orange-500 mt-1">{errors.paidEventMonthly}</p>
          )}

          <button onClick={handleNext}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
