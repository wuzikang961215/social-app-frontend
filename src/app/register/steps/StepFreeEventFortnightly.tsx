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
    `除了正式活动，我们也鼓励大家<b>自己发起小局</b>，比如约饭、KTV、逛展，认识更多聊得来的人。`,
    `朋友，往往是在<b>轻松又真实的场合</b>里慢慢熟起来的。`,
    `你发起，我们帮你推广；你参与，我们记得你的活跃。`,
    `<b>每两周</b>，发起活动累计<b>带来最多人</b>的用户，下一次正式活动<b>免费</b>！`,
    `参与次数<b>最多</b>的用户，也<b>免费</b>！`,
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
            你愿意每两周左右，<b>组织/参与</b>一次这样的会员自发活动吗？
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
