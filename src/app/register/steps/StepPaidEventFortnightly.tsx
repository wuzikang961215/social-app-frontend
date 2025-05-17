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
}: StepProps & { endFlow?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleSelect = (choice: string) => {
    setFormData({ paidEventFortnightly: choice });
    onError?.("paidEventFortnightly", "");
  };

  const handleNext = () => {
    if (!formData.paidEventFortnightly) {
      onError?.("paidEventFortnightly", "请选择一个选项");
      return;
    }
  
    onNext(); // ✅ 交由 register/page.tsx 的 handleNext 决定跳转去哪
  };
  

  const texts = [
    `我们每两周会举办一次<b>精心设计的线下活动</b>，帮助大家持续见面、逐步熟悉，建立真实而稳定的连接。`,
    `这些活动融合了心理学中被称为<b>「结构化连接模型」</b>（Inspired by Matthew Lieberman, UCLA）、<b>「快速朋友实验」</b>（Fast Friends Protocol，Arthur Aron）等研究成果，通过<b>高密度、强互动</b>的游戏机制，让你和在场每个人都能建立熟悉感。`,
    `我们设立了一定的参与门槛：每场活动费用为<b>34澳元</b>（这是我们给内部成员的<b>会员价</b>，公开定价为<b>49澳元</b>），主要用于场地、流程设计和社交机制搭建，时长<b>1.5小时</b>。`,
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
            你愿意每两周参加一次这样的付费活动吗？
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

          <p className="text-xs mt-1 italic">
          💡 特别说明：我们未来也可能开放部分<b>免费测试</b>活动，但名额有限，仅开放给认真填写完整问卷、符合系统匹配机制的用户。
          </p>
        </motion.div>
      )}
    </div>
  );
}
