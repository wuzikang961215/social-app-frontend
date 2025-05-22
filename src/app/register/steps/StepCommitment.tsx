"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepCommitment({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
  endFlow,
}: StepProps & { endFlow?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelect = (choice: string) => {
    setFormData({ commitment: choice });
    onError?.("commitment", "");
  };

  const handleNext = () => {
    if (!formData.commitment) {
      onError?.("commitment", "请选择一个选项");
      return;
    }

    if (formData.commitment === "否") {
      endFlow?.();
    } else {
      onNext();
    }
  };

  const texts = [
    `我们相信，真正有价值的社交，不是寒暄几句、交换联系方式，而是能够<b>建立持续连接</b>、真正熟起来的过程。`,
    `Yodda 的线下活动专为此而设计：<b>拒绝尴尬寒暄</b>、<b>避免低效社交</b>，通过结构化引导与现场氛围，帮助你遇见真正聊得来的人。`,
    `每一次见面，都是一次<b>人为策划的高质量互动</b>，让你在轻松的节奏中建立真实关系，而不是“到场即散”的形式主义社交。`,
  ];

  return (
    <div
      className="w-full max-w-md h-[365px] flex flex-col justify-start items-center text-center px-4 pt-3 pb-6 gap-3"
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
            你想试试看，加入这样一个不一样的社交圈吗？
          </div>

          <ToggleButtonGroup
            options={["是", "否"]}
            value={formData.commitment}
            onChange={handleSelect}
          />

          {errors?.commitment && (
            <p className="text-sm text-orange-500 mt-1">{errors.commitment}</p>
          )}

          <button onClick={handleNext}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
