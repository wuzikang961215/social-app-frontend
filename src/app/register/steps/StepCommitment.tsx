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
    `这是一个<b>不尴尬</b>、<b>不无聊</b>、<b>不尬聊</b>的线下小圈子，专治“社交死水”。`,
    `我们定期办一些<b>轻松又有点疯</b>的活动，帮你认识真·聊得来的人，不是加完就沉底的那种。`,
    `没有剧本杀、没有酒局，只有<b>人为设计的高质量巧遇</b>。有点刺激，有点走心，刚刚好。`,
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
            你想试试看，成为这个不一样的圈子的一员吗？
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
