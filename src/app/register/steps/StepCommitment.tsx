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
    `我们正在建立一个<b>人数不多、关系紧密</b>的小圈子，希望你不只是来“看一眼”，而是认真来交朋友。`,
    `为了让彼此真正熟起来，我们会<b>持续</b>举办<b>线下活动</b>。这需要每一位成员都<b>持续投入时间与精力</b>，建立真实质量的连接。`,
    `毕竟你也受够了，在澳洲一个人生活、没有能说<b>心里话</b>的人了，对吧？`,
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
            你愿意认真参与，成为这个小圈子的一员吗？
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
