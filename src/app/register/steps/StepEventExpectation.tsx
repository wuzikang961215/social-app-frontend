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
    if (!formData.expectPaid?.trim() || !formData.expectFree?.trim()) {
      if (!formData.expectPaid?.trim()) {
        onError?.("expectPaid", "不能为空");
      }
      if (!formData.expectFree?.trim()) {
        onError?.("expectFree", "不能为空");
      }
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
      <div className="text-base font-semibold text-gray-800">
        你对我们的活动有什么期待？
      </div>

      {/* 输入区 */}
      <div className="w-full flex flex-col gap-5">
        {/* 付费 */}
        <div className="w-full text-left">
          <label className="text-sm text-gray-700 mb-2 block italic">
            参加付费活动时，我期待
          </label>
          <input
            type="text"
            value={formData.expectPaid}
            onChange={(e) => {
              setFormData({ expectPaid: e.target.value });
              onError?.("expectPaid", "");
            }}
            placeholder="比如：有明确的互动环节，不会冷场也不会吵闹"
            className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {errors?.expectPaid && (
            <p className="text-sm text-orange-500 mt-2 italic tracking-wide">{errors.expectPaid}</p>
          )}
        </div>

        {/* 免费 */}
        <div className="w-full text-left">
          <label className="text-sm text-gray-700 mb-2 block italic">
            参加免费活动时，我期待
          </label>
          <input
            type="text"
            value={formData.expectFree}
            onChange={(e) => {
              setFormData({ expectFree: e.target.value });
              onError?.("expectFree", "");
            }}
            placeholder="比如：我能和人说上话，而不是坐在角落没人理"
            className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {errors?.expectFree && (
            <p className="text-sm text-orange-500 mt-2 italic tracking-wide">{errors.expectFree}</p>
          )}
        </div>
      </div>

      {/* 按钮 */}
      <button onClick={handleNext} className="mt-2">
        <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
      </button>
    </motion.div>
  );
}
