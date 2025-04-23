"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/api";

export default function StepPromote({
  formData,
  setFormData,
  onError,
  errors,
}: StepProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleSelect = (choice: string) => {
    setFormData({ willPromote: choice });
    onError?.("willPromote", "");
  };

  const handleSubmit = async () => {
    if (!formData.willPromote) {
      onError?.("willPromote", "请选择一个选项");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          personality: formData.personality,
          interests: formData.interests,
          canJoinPaid: formData.paidEventFortnightly === "是",
          canJoinPaidMonthly: formData.paidEventMonthly === "是",
          canJoinFree: formData.freeEventFortnightly === "是",
          canJoinFreeMonthly: formData.freeEventMonthly === "是",
          expectPaid: formData.expectPaid,
          expectFree: formData.expectFree,
          whyJoin: formData.whyJoin,
          idealBuddy: formData.idealBuddy,
          willPromote: formData.willPromote === "是",
        }),
      });
  
      if (!response.ok) throw new Error("提交失败");
  
      router.push("/register/success");
    } catch (err) {
      console.error("注册失败", err);
      alert("提交失败，请稍后再试");
    }
  };

  const texts = [
    `最后一个问题，也是最重要的问题 👇`,
    `为了真正解决澳洲留学生<b>孤单、无聊、找搭子难</b>的问题，我们正努力发展这个高质量社群。`,
    `作为第一批<b>“核心社交达人”</b>，你愿意主动宣传我们的社群和 App，组织活动，帮大家交朋友吗？`,
  ];

  return (
    <div
      className="w-full max-w-md h-[365px] flex flex-col justify-center items-center text-center px-4 pt-3 pb-6 gap-3"
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
          <ToggleButtonGroup
            options={["是", "否"]}
            value={formData.willPromote}
            onChange={handleSelect}
          />

          {errors?.willPromote && (
            <p className="text-sm text-orange-500 mt-1">{errors.willPromote}</p>
          )}

          <button onClick={handleSubmit}>
            <CheckCircle className="w-8 h-8 text-green-500 hover:scale-110 transition mt-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
