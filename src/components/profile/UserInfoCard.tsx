import { useState } from "react";
import { User, HeartHandshake, BadgeCheck, Save, X, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { getMBTIDisplay, mbtiTypes } from "@/lib/mbtiConstants";

export default function UserInfoCard({
  user,
  onUpdate,
}: {
  user: {
    id: string;
    username: string;
    email?: string;
    idealBuddy?: string;
    whyJoin?: string;
    interests?: string[];
    mbti?: string;
  };
  onUpdate?: (updatedUser: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idealBuddy: user.idealBuddy || "",
    whyJoin: user.whyJoin || "",
    interests: user.interests || [],
    mbti: user.mbti || "",
  });
  const [interestInput, setInterestInput] = useState("");

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.user.update(user.id, formData);
      toast.success("资料更新成功");
      setIsEditing(false);
      // Update the user object directly
      Object.assign(user, formData);
      if (onUpdate) {
        onUpdate({ ...user, ...formData });
      }
    } catch (error) {
      toast.error("更新失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      idealBuddy: user.idealBuddy || "",
      whyJoin: user.whyJoin || "",
      interests: user.interests || [],
      mbti: user.mbti || "",
    });
    setInterestInput("");
    setIsEditing(false);
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()],
      });
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  if (isEditing) {
    return (
      <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white p-4 text-[13px] text-gray-700 space-y-2.5 border border-indigo-300 shadow-sm">
        <div className="flex items-center gap-1.5 font-semibold">
          <User size={14} className="text-gray-500" />
          {user.username}
        </div>
        
        <div className="space-y-1.5">
          <label className="flex items-start gap-1.5">
            <Brain size={16} className="text-purple-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-[10px] text-gray-600">MBTI类型：</span>
              <select
                value={formData.mbti}
                onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                className="w-full mt-0.5 px-2 py-1 text-[10px] border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">选择你的MBTI类型</option>
                {mbtiTypes.map(({ type, name }) => (
                  <option key={type} value={type}>{type} - {name}</option>
                ))}
              </select>
            </div>
          </label>
          
          <label className="flex items-start gap-1.5">
            <HeartHandshake size={16} className="text-indigo-400 mt-0.5" />
            <div className="flex-1">
              <span className="text-[10px] text-gray-600">想遇见的朋友：</span>
              <input
                type="text"
                value={formData.idealBuddy}
                onChange={(e) => setFormData({ ...formData, idealBuddy: e.target.value })}
                className="w-full mt-0.5 px-2 py-1 text-[10px] border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="描述你想认识什么样的朋友"
              />
            </div>
          </label>
          
          <div>
            <label className="flex items-start gap-1.5">
              <BadgeCheck size={16} className="text-green-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-[10px] text-gray-600">爱好：</span>
                <div className="flex flex-wrap gap-1 mt-0.5 mb-1">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={`${interest}-${index}`}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 rounded-full text-[10px]"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeInterest(interest);
                        }}
                        className="text-gray-500 hover:text-red-500 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                    className="flex-1 px-2 py-1 text-[10px] border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="添加爱好，按回车确认"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      addInterest();
                    }}
                    className="px-1.5 py-1 text-[10px] bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    添加
                  </button>
                </div>
              </div>
            </label>
          </div>
          
          <div>
            <span className="text-[10px] text-gray-600">为什么想加入：</span>
            <textarea
              value={formData.whyJoin}
              onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
              className="w-full mt-0.5 px-2 py-1 text-[10px] border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              placeholder="分享你加入的原因"
            />
          </div>
        </div>
        
        <div className="pt-1 flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="text-[10px] px-2.5 py-0.5 rounded-full"
            onClick={handleCancel}
            disabled={loading}
          >
            <X size={12} className="mr-0.5" /> 取消
          </Button>
          <Button
            size="sm"
            className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={12} className="mr-0.5" /> 保存
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-white to-gray-50 p-4 text-[13px] text-gray-700 space-y-2 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 font-semibold">
        <User size={16} className="text-gray-500" />
        {user.username}
      </div>
      <div className="flex items-start gap-1.5">
        <Brain size={14} className="text-purple-400 mt-0.5" />
        <span>MBTI：{getMBTIDisplay(user.mbti)}</span>
      </div>
      <div className="flex items-start gap-1.5">
        <HeartHandshake size={14} className="text-indigo-400 mt-0.5" />
        <span>想遇见的朋友：&ldquo;{user.idealBuddy || "未填写"}&rdquo;</span>
      </div>
      <div className="flex items-start gap-1.5">
        <BadgeCheck size={14} className="text-green-400 mt-0.5" />
        <span>爱好：{user.interests?.join("、") || "未填写"}</span>
      </div>
      <p className="italic text-gray-500 text-[11px]">&ldquo;{user.whyJoin || "TA 还没填写为什么想加入"}&rdquo;</p>
      <div className="pt-1 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="text-[10px] px-2.5 py-0.5 rounded-full border-gray-300 text-gray-600 hover:bg-gray-100"
          onClick={() => setIsEditing(true)}
        >
          ✏️ 修改资料
        </Button>
      </div>
    </div>
  );
}
