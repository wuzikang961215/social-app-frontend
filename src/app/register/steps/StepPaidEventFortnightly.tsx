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
    `Yodda 社交系统由一组连续的<b>16期线下实验</b>组成，每一期都围绕一个全新主题，设计独立的互动流程与社交机制。`,
    `活动融合心理学中的<b>结构化连接模型</b>（Structured Social Interaction, Lieberman, UCLA）与<b>快速朋友实验</b>（Fast Friends Protocol, Aron, 1997），每期通过<b>高密度引导+角色任务+沉浸氛围</b>，帮助你在 90 分钟内与在场大多数人建立自然熟悉感。`,
    `我们设立一定参与门槛：<b>会员票价 34澳元</b>，普通票价为 <b>49澳元</b>，费用用于场地、内容策划与机制搭建。每场活动限额人数，并持续优化匹配机制与用户质量。`,
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
            你愿意每两周参加一次Yodda官方付费活动吗？
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
