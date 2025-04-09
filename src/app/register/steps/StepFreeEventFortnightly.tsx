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
  const [hasClicked, setHasClicked] = useState(false);

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

  const introText = `我们每两周也会举办一次<b>免费活动</b>（如约饭、KTV、逛街等），由大家<b>投票决定形式</b>。`;

  return (
    <div
      className="w-full max-w-md h-[365px] flex flex-col justify-center items-center text-center px-4 pt-3 pb-6 gap-3"
      onClick={() => {
        if (!hasClicked) setHasClicked(true);
      }}
    >
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-sm text-gray-700 leading-relaxed italic"
        dangerouslySetInnerHTML={{ __html: introText }}
      />

      {/* 问题和选项（点击后出现） */}
      {hasClicked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 mt-3"
        >
          <div className="text-sm font-medium text-gray-800">
            你能每两周参加一次免费活动吗？
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
