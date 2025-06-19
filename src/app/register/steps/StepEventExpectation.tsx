"use client";
import { StepProps } from "../page";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepEventExpectation({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.expectEvent?.trim()) {
      onError?.("expectEvent", "不能为空");
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md flex flex-col items-center text-center gap-6"
    >
      {/* 主标题 */}
      <label className="block font-medium text-gray-700 text-m">
        你对 Yodda 活动有什么期待？
      </label>

      {/* 输入区 */}
      <div className="w-full text-left">
        <label className="text-sm text-gray-700 mb-2 block italic">
          我希望平台上的活动......
        </label>
        <input
          type="text"
          value={formData.expectEvent}
          onChange={(e) => {
            setFormData({ expectEvent: e.target.value });
            onError?.("expectEvent", "");
          }}
          placeholder="比如：多一些 KTV、徒步活动；能让我真的交到朋友"
          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {errors?.expectEvent && (
          <p className="text-sm text-orange-500 mt-2 italic tracking-wide">
            {errors.expectEvent}
          </p>
        )}
      </div>

      {/* 按钮 */}
      <button onClick={handleNext} className="mt-2">
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
      </button>
    </motion.div>
  );
}
