// app/register/steps/StepIdealBuddy.tsx
"use client";
import { StepProps } from "../page";
import { motion } from "framer-motion";
import { ArrowRightCircle } from "lucide-react";

export default function StepIdealBuddy({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const handleNext = () => {
    if (!formData.idealBuddy?.trim()) {
      onError?.("idealBuddy", "不能为空");
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
        你理想的搭子/朋友是什么样的？
      </div>

      <div className="w-full text-left">
        <label className="text-sm text-gray-700 mb-2 block italic">
          我希望遇见这样的搭子/朋友：
        </label>
        <input
          type="text"
          value={formData.idealBuddy}
          onChange={(e) => {
            setFormData({ idealBuddy: e.target.value });
            onError?.("idealBuddy", "");
          }}
          placeholder="比如：愿意主动约我、在我难过的时候能支持我的那种朋友"
          className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {errors?.idealBuddy && (
          <p className="text-sm text-orange-500 mt-2 italic tracking-wide">{errors.idealBuddy}</p>
        )}
      </div>

      <button onClick={handleNext} className="mt-2">
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1"/>
      </button>
    </motion.div>
  );
}