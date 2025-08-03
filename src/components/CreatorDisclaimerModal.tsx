import React, { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DisclaimerModal from "./DisclaimerModal";

interface CreatorDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const CreatorDisclaimerModal: React.FC<CreatorDisclaimerModalProps> = ({ isOpen, onClose, onAgree }) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            <motion.div
              className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">发起人安全须知</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <p className="text-gray-600">
                  作为活动发起人，请确保：
                </p>
                
                <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                  <ul className="space-y-1.5 list-disc pl-5 text-xs">
                    <li>活动内容健康、积极向上</li>
                    <li>选择安全的公共场所</li>
                    <li>提供真实准确的活动信息</li>
                    <li>保护参与者隐私和安全</li>
                    <li>遵守当地法律法规</li>
                  </ul>
                </div>
                
                <p className="text-xs text-gray-500 border-t pt-2">
                  💡 平台保留对违规内容进行管理的权利
                </p>
                
                <p className="text-sm mt-4">
                  详细的安全指南和平台责任说明，请查看
                  <button
                    type="button"
                    onClick={() => setShowDisclaimer(true)}
                    className="text-indigo-600 hover:text-indigo-500 underline mx-1"
                  >
                    免责声明
                  </button>
                </p>
                
                <p className="text-xs text-gray-500 italic">
                  Please ensure all activities are safe and legal.
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 px-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-sm"
                >
                  返回修改
                </button>
                <button
                  onClick={onAgree}
                  className="flex-1 py-2 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium"
                >
                  我已了解
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
      />
    </>
  );
};

export default CreatorDisclaimerModal;