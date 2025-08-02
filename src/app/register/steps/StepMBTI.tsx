"use client";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";

const mbtiTypes = [
  { type: 'INTJ', name: '建筑师', description: '富有想象力和战略性的思想家' },
  { type: 'INTP', name: '逻辑学家', description: '富有创造力的发明家' },
  { type: 'ENTJ', name: '指挥官', description: '大胆、富有想象力的领导者' },
  { type: 'ENTP', name: '辩论家', description: '聪明好奇的思想者' },
  { type: 'INFJ', name: '提倡者', description: '安静而神秘的理想主义者' },
  { type: 'INFP', name: '调停者', description: '诗意、善良的利他主义者' },
  { type: 'ENFJ', name: '主人公', description: '富有感召力的领导者' },
  { type: 'ENFP', name: '竞选者', description: '热情、有创造力的自由精神' },
  { type: 'ISTJ', name: '物流师', description: '实际且注重事实的个人' },
  { type: 'ISFJ', name: '守卫者', description: '非常专注而温暖的守护者' },
  { type: 'ESTJ', name: '总经理', description: '出色的管理者' },
  { type: 'ESFJ', name: '执政官', description: '极有同情心的合作者' },
  { type: 'ISTP', name: '鉴赏家', description: '大胆而实际的实验家' },
  { type: 'ISFP', name: '探险家', description: '灵活而有魅力的艺术家' },
  { type: 'ESTP', name: '企业家', description: '聪明、精力充沛的冒险家' },
  { type: 'ESFP', name: '表演者', description: '自发的、精力充沛的表演者' }
];

export default function StepMBTI({ formData, setFormData, onNext, onError }: StepProps) {
  const handleSelect = (mbti: string) => {
    // If clicking the same MBTI type, deselect it
    if (formData.mbti === mbti) {
      setFormData({ mbti: '' });
    } else {
      setFormData({ mbti });
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-4 text-center">
      <label className="font-medium text-gray-700">
        你的MBTI类型是？
      </label>
      
      <p className="text-xs text-gray-500 -mt-2">
        不知道你的类型？
        <a 
          href="https://www.16personalities.com/ch" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-500 hover:text-indigo-600 underline ml-1"
        >
          点击这里免费测试
        </a>
      </p>
      
      <div className="h-5">
        {formData.mbti && (
          <div className="text-sm text-indigo-600 font-medium">
            已选择: {mbtiTypes.find(t => t.type === formData.mbti)?.type} - {mbtiTypes.find(t => t.type === formData.mbti)?.name}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mx-auto">
        {mbtiTypes.map(({ type, name, description }) => (
          <button
            key={type}
            onClick={() => handleSelect(type)}
            className={`text-left p-3 border rounded-lg transition-all ${
              formData.mbti === type 
                ? 'border-indigo-400 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'
            }`}
          >
            <div className="font-semibold text-sm text-gray-800">{type}</div>
            <div className="text-xs text-gray-600">{name}</div>
            <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{description}</div>
          </button>
        ))}
      </div>

      {formData.mbti ? (
        <button onClick={handleNext}>
          <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition" />
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={handleNext}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            跳过此步骤
          </button>
        </div>
      )}
    </div>
  );
}