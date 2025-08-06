"use client";
import { StepProps } from "../page";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { useState } from "react";
import DisclaimerModal from "@/components/DisclaimerModal";

export default function StepPromote({
  formData,
}: StepProps) {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await registerUser(formData);
      console.log("Registration response:", response);
      
      // Check if registration was successful
      if (response && response.token) {
        // Save token to localStorage
        localStorage.setItem('token', response.token);
        router.push("/register/success");
      } else {
        // This shouldn't happen with the fixed backend
        console.error("Unexpected response format:", response);
        alert("注册响应格式错误，请联系管理员");
      }
    } catch (err: any) {
      console.error("注册失败:", err);
      // Show the actual error message from backend
      alert(err.message || "提交失败，请稍后再试");
    }
  };

  return (
    <>
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-1.5 px-4">
      {/* 标题 */}
      <div className="font-medium text-gray-700 text-sm">
        一切准备就绪
      </div>

      {/* 正文 */}
      <div className="text-xs text-gray-700 leading-relaxed tracking-wide italic">
        我们正在构建一个真实连接的社交空间，<br />
        在这里，大家都在认真交朋友。<br />
        欢迎你成为其中的一员。
      </div>

      {/* 条款同意 */}
      <div className="flex items-start gap-2 text-xs">
        <input
          type="checkbox"
          id="terms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
        />
        <div className="text-gray-600 leading-relaxed">
          <span>我已阅读并同意</span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowDisclaimer(true);
            }}
            className="text-indigo-600 hover:text-indigo-500 underline font-medium mx-1"
          >
            免责声明
          </button>
          <br />
          <span className="text-xs">I have read and agree to the disclaimer</span>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="flex flex-col items-center gap-1 mt-1">
        <button 
          onClick={handleSubmit}
          disabled={!agreedToTerms}
          className={`group ${!agreedToTerms ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <CheckCircle className={`w-8 h-8 ${agreedToTerms ? 'text-green-500 group-hover:scale-110' : 'text-gray-400'} transition-all duration-200`} />
        </button>
        <p className="text-xs text-gray-500 italic">
          {agreedToTerms ? '点击提交注册' : '请先勾选同意条款'}
        </p>
      </div>
      </div>
      
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </>
  );
}
