import React from "react";
import { X } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white z-10 p-3 border-b flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">免责声明 Disclaimer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        </div>
            
        <div className="p-3 overflow-y-auto max-h-[calc(90vh-48px)]">
          {/* Chinese Version */}
          <div className="mb-4">
            <p className="mb-3 text-xs text-gray-700 leading-relaxed">
              本平台（以下简称"我们"）是一款供用户自由发起和报名参与活动的社交工具。为保障您在使用过程中的权益，请仔细阅读以下免责声明。继续使用本平台即代表您已阅读、理解并接受本声明的全部内容。
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">平台角色</h3>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              Yodda 仅作为连接用户的中介平台。我们不是任何用户创建活动的组织者、赞助商或担保人。
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">活动性质说明</h3>
            <ul className="list-disc pl-4 mb-3 space-y-1 text-xs text-gray-700 leading-relaxed">
              <li>除标有官方认证标识的 Yodda 官方活动外，平台仅作为信息分享与联络工具，<strong className="font-semibold text-gray-900">不参与其他用户活动的策划、组织、管理或监督</strong>。</li>
              <li>非官方活动均由用户个人或团体发起，<strong className="font-semibold text-gray-900">平台无法验证其真实性、合法性或安全性</strong>。</li>
              <li>Yodda 官方活动会在发起人名称旁显示<strong className="font-semibold text-gray-900">官方认证标识</strong>。</li>
            </ul>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">责任限制</h3>
            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
              在法律允许的最大范围内，平台不承担以下责任：
            </p>
            <ul className="list-disc pl-4 mb-2 space-y-1 text-xs text-gray-700 leading-relaxed">
              <li>用户创建活动的内容准确性或安全性</li>
              <li>因参与活动可能造成的<strong className="font-semibold text-gray-900">人身伤害、财产损失、心理伤害、交通意外或其他任何不良后果</strong></li>
              <li>用户之间因活动产生的任何<strong className="font-semibold text-gray-900">争议、纠纷或事故</strong></li>
              <li>第三方内容或外部链接</li>
            </ul>
            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
              <strong className="font-semibold">关于Yodda官方活动：</strong>对于官方组织的活动，我们将在合理范围内履行组织职责并采取必要的安全措施，但除法律强制要求及因重大过失或违法行为外，不承担参与活动产生的任何损失或伤害责任。
            </p>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed bg-gray-50 p-2 rounded">
              <strong className="font-semibold">重要：</strong>本免责声明不排除或限制我们因重大过失、违法行为、误导或欺骗行为，或澳大利亚消费者法下不可排除的消费者保障而承担的责任。
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">用户责任</h3>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              使用本平台即表示您承认自愿承担参与活动的所有风险（法律规定不可排除的责任除外）。您应对自己的行为和选择承担全部责任，并自行判断活动的风险。
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">安全提醒</h3>
            <ul className="list-disc pl-4 mb-3 space-y-1 text-xs text-gray-700 leading-relaxed">
              <li>我们建议用户在参与任何线下活动前，充分了解活动内容、发起人背景与场地环境。</li>
              <li>首次见面请选择人多的公共场所。</li>
              <li>告知亲友您的活动安排。</li>
              <li>谨慎对待陌生人邀请，注意自身安全，如有疑虑请勿参与。</li>
            </ul>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">合规声明</h3>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              本平台遵守澳大利亚电子安全专员的行业标准和在线安全指南。
            </p>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* English Version */}
          <div>
            <p className="mb-3 text-xs text-gray-700 leading-relaxed">
              This platform (hereinafter referred to as "we" or "the platform") provides users with tools to publish and join events. Please read this disclaimer carefully before continuing to use the platform. By using our services, you acknowledge that you have read, understood, and agreed to the following terms.
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">Platform Role</h3>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              Yodda acts solely as an intermediary platform connecting users. We are not the organiser, sponsor, or guarantor of any user-created events.
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">Event Nature</h3>
            <ul className="list-disc pl-4 mb-3 space-y-1 text-xs text-gray-700 leading-relaxed">
              <li>Except for official Yodda events marked with an official badge, the platform only provides information sharing and registration functions. <strong className="font-semibold text-gray-900">We do not participate in the planning, organization, management, or supervision of other user events.</strong></li>
              <li>Non-official events are initiated by individual users or groups. <strong className="font-semibold text-gray-900">We do not verify the authenticity, legality, or safety of such events.</strong></li>
              <li>Official Yodda events display an <strong className="font-semibold text-gray-900">official verification badge</strong> next to the organizer's name.</li>
            </ul>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">Limitation of Liability</h3>
            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
              To the maximum extent permitted by law, the platform excludes liability for:
            </p>
            <ul className="list-disc pl-4 mb-2 space-y-1 text-xs text-gray-700 leading-relaxed">
              <li>Content accuracy or safety of user-created events</li>
              <li><strong className="font-semibold text-gray-900">Personal injury, property loss, mental harm, traffic incidents, or any other consequences</strong> arising from event participation</li>
              <li>Any <strong className="font-semibold text-gray-900">conflict, dispute, or accident</strong> arising between users</li>
              <li>Third-party content or external links</li>
            </ul>
            <p className="text-xs text-gray-700 mb-2 leading-relaxed">
              <strong className="font-semibold">For Official Yodda Events:</strong> For events organized by Yodda, we will perform our organizational duties within reasonable limits and take necessary safety measures, but—except as required by law and for gross negligence or unlawful conduct—accepts no liability for any loss or injury arising from participation.
            </p>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed bg-gray-50 p-2 rounded">
              <strong className="font-semibold">Important:</strong> Nothing in this disclaimer excludes or limits our liability for gross negligence, unlawful conduct, misleading or deceptive conduct, or any consumer guarantees under Australian Consumer Law that cannot be excluded.
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">User Responsibility</h3>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              By using this platform, you acknowledge that you voluntarily assume all risks associated with participating in events (except where liability cannot be excluded under law). You are fully responsible for your own actions and decisions.
            </p>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">Safety Tips</h3>
            <ul className="list-disc pl-4 mb-3 space-y-1 text-xs text-gray-700 leading-relaxed">
              <li>We recommend users thoroughly understand the event details, host identity, and venue before participating.</li>
              <li>Meet first time in busy public places.</li>
              <li>Tell friends/family about your plans.</li>
              <li>Be cautious when interacting with strangers and always prioritize your personal safety.</li>
            </ul>

            <h3 className="text-sm font-bold mb-1.5 text-gray-800">Compliance Statement</h3>
            <p className="text-xs text-gray-700 mb-3 leading-relaxed">
              This platform complies with Australian eSafety Commissioner industry standards and guidelines for online safety.
            </p>
          </div>

          {/* Legal References */}
          <hr className="my-4 border-gray-300" />
          <div className="text-xs text-gray-500">
            <p className="font-semibold mb-1">Legal References | 法律参考</p>
            <ul className="space-y-0.5">
              <li>• Competition and Consumer Act 2010 (Cth) s139A</li>
              <li>• Civil Liability Act 2002 (NSW) ss 5L, 5M</li>
              <li>• Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010)</li>
              <li>• eSafety Commissioner Act 2015 (Cth)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;