"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepFreeEventFortnightly({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelect = (choice: string) => {
    setFormData({ freeEventFortnightly: choice });
    onError?.("freeEventFortnightly", "");
  };

  const handleNext = () => {
    if (!formData.freeEventFortnightly) {
      onError?.("freeEventFortnightly", "请选择一个选项");
      return;
    }
    onNext();
  };

  const texts = [
    `除了正式活动以外，我们也会定期组织一些<b>轻型社群活动</b>（如约饭、KTV、逛展等）。`,
    `这类活动是<b>自费参与</b>，形式轻松，不包含结构化引导，主要用于熟悉氛围、缓解初期陌生感。`,
    `它们与正式的付费活动<b>互为补充</b>，共同构成我们的真实社交系统。`,
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
            你能每两周参加一次这样的社群活动吗？
          </div>

          <ToggleButtonGroup
            options={["是", "否"]}
            value={formData.freeEventFortnightly}
            onChange={handleSelect}
          />

          {errors?.freeEventFortnightly && (
            <p className="text-sm text-orange-500 mt-1">{errors.freeEventFortnightly}</p>
          )}

          <button onClick={handleNext}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
