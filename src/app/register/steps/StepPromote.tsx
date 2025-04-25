"use client";
import { useState } from "react";
import { StepProps } from "../page";
import ToggleButtonGroup from "@/components/register/ToggleButtonGroup";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/api";

export default function StepPromote(props: StepProps) {
  const { formData, setFormData, onError, errors } = props;
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
    `你是我们App最早的一批用户，也是我们的<b>核心共建者</b>。`,
    `我们正在一起创建一个全新的<b>高质量社交网络</b>，彻底改变澳洲留学生<b>孤单、无聊、找不到搭子</b>的现状。`,
    `未来，会有越来越多的用户通过 App 申请加入我们的社群，而你，将拥有以下权限：`,
    `发起自己的社交活动，新用户需要参加<b>你的</b>活动，才能进入系统；邀请你信任的人，<b>直接</b>加入；审核活动参与者，<b>筛选</b>出真心想交朋友的人。`,
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
            你愿意一起点燃这个城市的社交火花吗？
          </div>

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
