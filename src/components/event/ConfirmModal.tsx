import React, { useState } from "react";
import DisclaimerModal from "@/components/DisclaimerModal";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  spotsLeft,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  spotsLeft: number;
}) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 space-y-4 relative">
        <h2 className="text-lg font-semibold text-gray-800">
          要一起参加「{title}」吗？
        </h2>
        <p className="text-sm text-gray-600">
          报名即表示你会参加。被发起人确认后，原则上无法取消，感谢理解！
        </p>
        
        {/* 温馨提示 */}
        <p className="text-xs text-gray-500">
          点击确认即表示你已了解
          <button 
            type="button"
            onClick={() => setShowDisclaimer(true)}
            className="underline hover:text-gray-700 mx-1"
          >
            免责声明
          </button>
          ，请注意活动安全。
        </p>
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            好的，加入
          </button>
        </div>
      </div>
      
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </div>
  );
}
