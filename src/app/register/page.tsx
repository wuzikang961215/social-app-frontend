"use client";

import { useRef, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import StepWelcome from "./steps/StepWelcome";
import StepUsername from "./steps/StepUsername";
import StepEmail from "./steps/StepEmail";
import StepPassword from "./steps/StepPassword";
import StepMBTI from "./steps/StepMBTI";
import StepLookingForBuddy from "./steps/StepLookingForBuddy";
import StepExpectHighQualityBuddy from "./steps/StepExpectHighQualityBuddy";
import StepInterest from "./steps/StepInterest";
import StepEventExpectation from "./steps/StepEventExpectation";
import StepWhyJoin from "./steps/StepWhyJoin"; 
import StepIdealBuddy from "./steps/StepIdealBuddy";
import StepPromote from "./steps/StepPromote";

const steps = [
  "welcome",
  "username",
  "email",
  "password",
  "mbti",
  "lookingForBuddy",
  "expectingHighQualityBuddy",
  "interest",
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
  mbti: string;
  lookingForBuddy: string;
  expectingHighQualityBuddy: string;
  interests: string[];
  expectEvent: string;      
  whyJoin: string;
  idealBuddy: string; 
  willPromote: string
}

export interface StepProps {
  formData: FormDataType;
  setFormData: (data: Partial<FormDataType>) => void;
  onNext: () => void;
  onError?: (
    field: keyof FormDataType | "confirmPassword",
    message: string
  ) => void;
  errors?: Partial<Record<keyof FormDataType | "confirmPassword", string>>;
  endFlow?: () => void;
}


const stepComponents: Record<StepKey, React.FC<StepProps>> = {
  welcome: StepWelcome,
  username: StepUsername,
  email: StepEmail,
  password: StepPassword,
  mbti: StepMBTI,
  lookingForBuddy: StepLookingForBuddy,
  expectingHighQualityBuddy: StepExpectHighQualityBuddy,
  interest: StepInterest,
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
    mbti: "",
    lookingForBuddy: "",
    expectingHighQualityBuddy: "",
    interests: [],
    expectEvent: "", 
    whyJoin: "",
    idealBuddy: "",
    willPromote: ""    
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const currentKey = steps[stepIndex];
  const isTransitioningRef = useRef(false);
  const router = useRouter();

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
  
    setStepIndex((prev) => prev + 1);
  
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 700);
  }, []);
  
  const CurrentStep = stepComponents[currentKey]; // 👈 加上这个
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="bg-white p-6 shadow-xl rounded-xl w-full max-w-lg min-h-[450px] flex flex-col relative"
      >
        {/* 🔒 顶部按钮浮动定位 */}
        <LogOut
          onClick={() => {
            router.push("/login");
          }}
          className="absolute top-3 right-3 w-4 h-4 text-gray-500 hover:text-gray-800 cursor-pointer hover:scale-110"
        />

        {stepIndex > 0 && (
          <button
            onClick={() => setStepIndex(stepIndex - 1)}
            className="absolute top-3 left-3 text-gray-400 hover:text-indigo-500 transition text-base hover:scale-110"
            title="上一步"
          >
            ←
          </button>
        )}

        {/* 🎯 顶部标题区域 */}
        <div className="text-center mb-4">
          <div className="h-4" /> {/* 留白占位，跟拒绝页统一 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-lg font-bold text-gray-800">
              让认真交朋友的人相遇
            </h1>
            <p className="text-xs text-gray-500 mt-1 italic tracking-wide">
              从兴趣出发，找到与你合拍的人
            </p>
          </motion.div>
        </div>

        {/* 💫 动画内容区 */}
        
        <>
          <div className="flex-grow flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[stepIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex justify-center"
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
          <motion.div className="mt-8" animate={{ opacity: 1 }}>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-[10px] text-gray-500 mt-1">
              <b>{stepIndex + 1}</b> / {steps.length}
            </p>
          </motion.div>
        </>
        
      </div>
    </div>
  );
}
