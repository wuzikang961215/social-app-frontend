// app/register/steps/StepWhyJoin.tsx
"use client";
import { StepProps } from "../page";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepWhyJoin({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.whyJoin?.trim()) {
      onError?.("whyJoin", "不能为空");
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
      <div className="text-base font-semibold text-gray-800">
        你为什么想要加入我们的高质量搭子社群？
      </div>

      <div className="w-full text-left">
        <label className="text-sm text-gray-700 mb-2 block italic">
          我想加入是因为……
        </label>
        <input
          type="text"
          value={formData.whyJoin}
          onChange={(e) => {
            setFormData({ whyJoin: e.target.value });
            onError?.("whyJoin", "");
          }}
          placeholder="比如：在澳洲太无聊了，真的很想找到聊得来、有趣的人"
          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {errors?.whyJoin && (
          <p className="text-sm text-orange-500 mt-2 italic tracking-wide">{errors.whyJoin}</p>
        )}
      </div>

      <button onClick={handleNext} className="mt-2">
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
      </button>
    </motion.div>
  );
}
