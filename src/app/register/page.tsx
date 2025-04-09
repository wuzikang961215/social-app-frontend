"use client";

import { useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import StepWelcome from "./steps/StepWelcome";
import StepUsername from "./steps/StepUsername";
import StepEmail from "./steps/StepEmail";
import StepPassword from "./steps/StepPassword";
import StepPersonality from "./steps/StepPersonality";
import StepLookingForBuddy from "./steps/StepLookingForBuddy";
import StepExpectHighQualityBuddy from "./steps/StepExpectHighQualityBuddy";
import StepInterest from "./steps/StepInterest";
import StepCommitment from "./steps/StepCommitment";
import StepPaidEventFortnightly from "./steps/StepPaidEventFortnightly";
import StepPaidEventMonthly from "./steps/StepPaidEventMonthly";
import StepFreeEventFortnightly from "./steps/StepFreeEventFortnightly";
import StepFreeEventMonthly from "./steps/StepFreeEventMonthly";
import StepEventExpectation from "./steps/StepEventExpectation";
import StepWhyJoin from "./steps/StepWhyJoin"; 
import StepIdealBuddy from "./steps/StepIdealBuddy";
import StepPromote from "./steps/StepPromote";

const steps = [
  "welcome",
  "username",
  "email",
  "password",
  "personality",
  "lookingForBuddy",
  "expectingHighQualityBuddy",
  "interest",
  "commitment",
  "paidEventFortnightly",
  "paidEventMonthly",   // 第 10 题（可选）
  "freeEventFortnightly",      // 第 11 题
  "freeEventMonthly",
  "eventExpectation",
  "whyJoin",
  "idealBuddy",
  "promote"
] as const;
type StepKey = typeof steps[number];

export interface FormDataType {
  username: string;
  email: string;
  password: string;
  personality: string;
  lookingForBuddy: string;
  expectingHighQualityBuddy: string;
  interests: string[];
  commitment: string;
  paidEventFortnightly: string;
  paidEventMonthly: string;
  freeEventFortnightly: string;
  freeEventMonthly: string;
  expectPaid: string;      
  expectFree: string;     
  whyJoin: string;
  idealBuddy: string; 
  willPromote: string
}

interface StepProps {
  formData: FormDataType;
  setFormData: (data: Partial<FormDataType>) => void;
  onNext: () => void;
  onError?: (key: keyof FormDataType, msg: string) => void;
  errors?: Partial<Record<keyof FormDataType, string>>;
  endFlow?: () => void;
}

const stepComponents: Record<StepKey, React.FC<StepProps>> = {
  welcome: StepWelcome,
  username: StepUsername,
  email: StepEmail,
  password: StepPassword,
  personality: StepPersonality,
  lookingForBuddy: StepLookingForBuddy,
  expectingHighQualityBuddy: StepExpectHighQualityBuddy,
  interest: StepInterest,
  commitment: StepCommitment,
  paidEventFortnightly: StepPaidEventFortnightly,
  paidEventMonthly: StepPaidEventMonthly,
  freeEventFortnightly: StepFreeEventFortnightly,
  freeEventMonthly: StepFreeEventMonthly,
  eventExpectation: StepEventExpectation, 
  whyJoin: StepWhyJoin,
  idealBuddy: StepIdealBuddy,
  promote: StepPromote
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    email: "",
    password: "",
    personality: "",
    lookingForBuddy: "",
    expectingHighQualityBuddy: "",
    interests: [],
    commitment: "",
    paidEventFortnightly: "",
    paidEventMonthly: "",
    freeEventFortnightly: "",
    freeEventMonthly: "",
    expectPaid: "", 
    expectFree: "",    
    whyJoin: "",
    idealBuddy: "",
    willPromote: ""    
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [hasClickedIntro, setHasClickedIntro] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const currentKey = steps[stepIndex];
  const isTransitioningRef = useRef(false);
  const router = useRouter();

    const handleNext = useCallback(() => {
  if (isTransitioningRef.current) return;
  isTransitioningRef.current = true;

  const current = steps[stepIndex];

  if (current === "paidEventFortnightly") {
        const next = formData.paidEventFortnightly === "否"
        ? "paidEventMonthly"
        : "freeEventFortnightly";
        setStepIndex(steps.indexOf(next));
    } else if (current === "freeEventFortnightly") {
        const next = formData.freeEventFortnightly === "否"
        ? "freeEventMonthly"
        : "eventExpectation"; // 正常下一题
        setStepIndex(steps.indexOf(next));
    } else {
        setStepIndex((prev) => prev + 1); // 默认逻辑
    }

    setTimeout(() => {
        isTransitioningRef.current = false;
    }, 700);
    }, [stepIndex, formData.paidEventFortnightly, formData.freeEventFortnightly]);



  const CurrentStep = stepComponents[currentKey];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="bg-white p-10 shadow-xl rounded-2xl w-full max-w-lg min-h-[700px] flex flex-col relative"
        onClick={() => !hasClickedIntro && setHasClickedIntro(true)}
      >
        {/* 🔒 顶部按钮浮动定位 */}
        <LogOut
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="absolute top-4 right-4 w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer hover:scale-110"
        />

        {stepIndex > 0 && (
          <button
            onClick={() => setStepIndex(stepIndex - 1)}
            className="absolute top-4 left-4 text-gray-400 hover:text-indigo-500 transition text-lg hover:scale-110"
            title="上一步"
          >
            ←
          </button>
        )}

        {/* 🎯 顶部标题区域 */}
        <div className="text-center mb-6">
          <div className="h-6" /> {/* 留白占位，跟拒绝页统一 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-2xl font-bold text-gray-800">
              帮你找到真正的朋友
            </h1>
            <p className="text-sm text-gray-500 mt-2 italic tracking-wide">
              🧊 让我们一起击碎这个冷漠的世界
            </p>
          </motion.div>
        </div>

        {/* 💫 动画内容区 */}
        {hasClickedIntro && (
          <>
            <div className="flex-grow flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[stepIndex]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full"
                >
                  <CurrentStep
                    formData={formData}
                    setFormData={(data) => setFormData({ ...formData, ...data })}
                    onNext={handleNext}
                    onError={(key, msg) => setErrors({ ...errors, [key]: msg })}
                    errors={errors}
                    endFlow={() => router.push("/register/rejected")}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 🔄 底部进度条 */}
            <motion.div className="mt-24" animate={{ opacity: 1 }}>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                <b>{stepIndex + 1}</b> / {steps.length}
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
