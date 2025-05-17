"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepFreeEventMonthly({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelect = (choice: string) => {
    setFormData({ freeEventMonthly: choice });
    onError?.("freeEventMonthly", "");
  };

  const handleNext = () => {
    if (!formData.freeEventMonthly) {
      onError?.("freeEventMonthly", "请选择一个选项");
      return;
    }
    onNext();
  };

  const texts = [
    `没关系，我们知道每个人的时间都不一样～`,
    `如果两周一次有点紧，你会愿意<b>每月至少</b>一次，组织/参与这样的活动吗？`,
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
            你愿意每月至少组织/参加一次这样的会员自发活动吗？
          </div>

          <ToggleButtonGroup
            options={["是", "否"]}
            value={formData.freeEventMonthly}
            onChange={handleSelect}
          />

          {errors?.freeEventMonthly && (
            <p className="text-sm text-orange-500 mt-1">{errors.freeEventMonthly}</p>
          )}

          <button onClick={handleNext}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
