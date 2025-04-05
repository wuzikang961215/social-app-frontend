// app/register/page.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import StepWelcome from "./steps/StepWelcome";
import StepUsername from "./steps/StepUsername";

const steps = ["welcome", "username"] as const;
type StepKey = typeof steps[number];

export interface FormDataType {
  username: string;
}

interface StepProps {
  formData: FormDataType;
  setFormData: (data: Partial<FormDataType>) => void;
  onNext: () => void;
  onError?: (key: keyof FormDataType, msg: string) => void;
  errors?: Partial<Record<keyof FormDataType, string>>;
}

const stepComponents: Record<StepKey, React.FC<StepProps>> = {
  welcome: StepWelcome,
  username: StepUsername,
};

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [hasClickedIntro, setHasClickedIntro] = useState(false);
  const router = useRouter();

  const CurrentStep = stepComponents[steps[step]];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div
        className="bg-white p-10 shadow-xl rounded-2xl w-full max-w-lg min-h-[700px] flex flex-col relative"
        onClick={() => {
          if (!hasClickedIntro) setHasClickedIntro(true);
        }}
      >
        <div className="text-center mb-4">
          <div className="text-center mb-6">
            <div className="flex justify-between items-center mb-6">
              <LogOut
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="absolute top-4 right-4 w-5 h-5 text-gray-500 hover:text-gray-800 cursor-pointer hover:scale-110"
              />
            </div>

            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="absolute top-4 left-4 text-gray-400 hover:text-indigo-500 transition text-lg hover:scale-110"
                title="上一步"
              >
                ←
              </button>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-center mb-6"
                >
                <h1 className="text-2xl font-bold text-gray-800">
                        帮你找到真正的朋友
                </h1>
                <p className="text-sm text-gray-500 mt-2 italic tracking-wide">
                    🧊 让我们一起击碎这个冷漠的世界
                </p>
            </motion.div>

          </div>
        </div>

        {hasClickedIntro && (
          <>
            <div className="flex-grow flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[step]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full"
                >
                  <CurrentStep
                    formData={formData}
                    setFormData={(data) => setFormData({ ...formData, ...data })}
                    onNext={() => setStep((s) => s + 1)}
                    onError={(key, msg) => setErrors({ ...errors, [key]: msg })}
                    errors={errors}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 进度条 */}
            <motion.div className="mt-24" animate={{ opacity: 1 }}>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">
                <b>{step + 1}</b> / {steps.length}
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
