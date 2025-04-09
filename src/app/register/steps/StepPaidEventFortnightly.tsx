"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepPaidEventFortnightly({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
  endFlow,
}: StepProps & { endFlow?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelect = (choice: string) => {
    setFormData({ paidEventFortnightly: choice });
    onError?.("StepPaidEventFortnightly", "");
  };

  const handleNext = () => {
    if (!formData.paidEventFortnightly) {
      onError?.("paidEventFortnightly", "请选择一个选项");
      return;
    }
  
    onNext(); // ✅ 交由 register/page.tsx 的 handleNext 决定跳转去哪
  };
  

  const texts = [
    `我们每两周会举办一次<b>精心设计的付费活动</b>，帮助大家不断见面、保持互动。`,
    `我们的付费活动，融合了心理学中被称为<b>「结构化连接模型」</b>（Inspired by Matthew Lieberman, UCLA）、<b>「快速朋友实验」</b>（Fast Friends Protocol，Arthur Aron）等研究成果，通过<b>高密度、强互动</b>的游戏机制，让大家迅速破冰、自然熟络，没有尴尬，只有笑声。`,
    `我们保证：<b>每个人</b>都能和在场<b>所有人</b>交上朋友。没有冷场，没有例外。`,
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
            你能每两周参加一次付费活动吗？
          </div>

          <ToggleButtonGroup
            options={["是", "否"]}
            value={formData.paidEventFortnightly}
            onChange={handleSelect}
          />

          {errors?.paidEventFortnightly && (
            <p className="text-sm text-orange-500 mt-1">{errors.paidEventFortnightly}</p>
          )}

          <button onClick={handleNext}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
