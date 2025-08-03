import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <motion.div
            className="relative bg-white rounded-2xl w-full max-w-lg lg:max-w-2xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b flex justify-between items-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">免责声明 Disclaimer</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-64px)]">
              {/* Chinese Version */}
              <div className="mb-6 sm:mb-8">
                <p className="mb-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                  本平台（以下简称&ldquo;我们&rdquo;）是一款供用户自由发起和报名参与活动的社交工具。为保障您在使用过程中的权益，请仔细阅读以下免责声明。继续使用本平台即代表您已阅读、理解并接受本声明的全部内容。
                </p>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">活动性质说明</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>平台仅作为信息分享与联络工具，<strong className="font-semibold text-gray-900">不参与任何活动的策划、组织、管理或监督</strong>。</li>
                  <li>所有活动均由用户个人或团体发起，<strong className="font-semibold text-gray-900">平台无法验证其真实性、合法性或安全性</strong>。</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">风险与责任</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>用户应对自己的行为和选择承担全部责任。包括但不限于因参与活动可能造成的<strong className="font-semibold text-gray-900">人身伤害、财产损失、心理伤害、交通意外或其他任何不良后果</strong>。</li>
                  <li>用户应自行判断活动的风险并自行决定是否参与，<strong className="font-semibold text-gray-900">平台对此不承担任何法律责任或经济赔偿责任</strong>。</li>
                  <li>用户之间因活动产生的任何<strong className="font-semibold text-gray-900">争议、纠纷或事故</strong>，应由相关各方自行解决，<strong className="font-semibold text-gray-900">平台不介入亦不承担责任</strong>。</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">安全提醒</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>我们建议用户在参与任何线下活动前，充分了解活动内容、发起人背景与场地环境。</li>
                  <li>谨慎对待陌生人邀请，注意自身安全，如有疑虑请勿参与。</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">法律适用</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>本免责声明适用澳大利亚现行法律。</li>
                  <li>若用户违反相关法律法规或本平台条款，造成自身或他人损失，责任由用户自行承担。</li>
                </ul>
              </div>

              <hr className="my-6 sm:my-8 border-gray-300" />

              {/* English Version */}
              <div>
                <p className="mb-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                  This platform (hereinafter referred to as &ldquo;we&rdquo; or &ldquo;the platform&rdquo;) provides users with tools to publish and join events. Please read this disclaimer carefully before continuing to use the platform. By using our services, you acknowledge that you have read, understood, and agreed to the following terms.
                </p>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">Event Nature</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>The platform only provides information sharing and registration functions. <strong className="font-semibold text-gray-900">We do not participate in the planning, organization, management, or supervision of any event.</strong></li>
                  <li>All events are initiated by individual users or groups. <strong className="font-semibold text-gray-900">We do not verify the authenticity, legality, or safety of any event.</strong></li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">Risk and Liability</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>Users are fully responsible for their own actions and decisions. This includes but is not limited to <strong className="font-semibold text-gray-900">personal injury, property loss, mental harm, traffic incidents, or any other consequences</strong> arising from event participation.</li>
                  <li>Users must evaluate the risk of each event independently and decide whether to participate. <strong className="font-semibold text-gray-900">We accept no legal or financial liability.</strong></li>
                  <li>Any <strong className="font-semibold text-gray-900">conflict, dispute, or accident</strong> arising between users must be resolved by the parties involved. <strong className="font-semibold text-gray-900">The platform will not intervene or assume any responsibility.</strong></li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">Safety Tips</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>We recommend users thoroughly understand the event details, host identity, and venue before participating.</li>
                  <li>Be cautious when interacting with strangers and always prioritize your personal safety.</li>
                </ul>

                <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-800">Governing Law</h3>
                <ul className="list-disc pl-4 sm:pl-5 mb-4 space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed">
                  <li>This disclaimer is governed by the laws of Australia.</li>
                  <li>If a user violates local laws or this platform&apos;s terms, they are solely responsible for any resulting damages or consequences.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DisclaimerModal;