"use client";
import { useState } from "react";
import { StepProps } from "../page";
import { ArrowRightCircle } from "lucide-react";
import MainInterestSelector from "@/components/register/MainInterestSelector";
import SubInterestSelector from "@/components/register/SubInterestSelector";
import SelectedTags from "@/components/register/SelectedTags";
import CustomInterestInput from "@/components/register/CustomInterestInput";

const mainOptions = [
  "运动与户外", "音乐与影视", "美食与社交", "旅行与摄影", "学习与职业", "其他",
];

const subOptionsMap: Record<string, string[]> = {
  "运动与户外": ["排球", "羽毛球", "篮球", "健身", "徒步", "骑行", "桌上足球", "飞盘", "游泳", "跳舞", "冲浪", "跑步", "赛车"],
  "音乐与影视": ["K-pop", "Livehouse", "吉他", "唱歌", "钢琴", "看电影", "看剧", "音乐剧", "配音", "街头表演", "蹦迪", "音乐节"],
  "美食与社交": ["火锅", "甜品", "奶茶", "下厨", "撸串", "聚餐", "约饭", "桌游", "话剧", "密室", "狼人杀", "剧本杀", "喝酒"],
  "旅行与摄影": ["拍照", "陪拍", "vlog", "探索小众景点", "城市漫步", "海边日落", "民宿控", "住青旅", "打工旅行"],
  "学习与职业": ["英语口语", "刷题学习", "看书", "图书馆", "编程", "职业规划", "AI", "开发软件", "职业竞技与比赛"],
};

export default function StepInterest({
  formData,
  setFormData,
  onNext,
  onError,
  errors,
}: StepProps) {
  const [selectedMain, setSelectedMain] = useState("");
  const [customText, setCustomText] = useState("");

  const selectedSubs = formData.interests || [];

  const handleSubToggle = (item: string) => {
    if (selectedSubs.includes(item)) {
      setFormData({ interests: selectedSubs.filter(i => i !== item) });
    } else {
      if (selectedSubs.length >= 7) return;
      setFormData({ interests: [...selectedSubs, item] });
    }
    onError?.("interests", "");
  };

  const handleMainSelect = (main: string) => {
    setSelectedMain(main);
  };

  const handleNext = () => {
    const finalInterests = formData.interests || [];

    if (finalInterests.length < 2 || finalInterests.length > 7) {
      onError?.("interests", "请至少添加 2 个兴趣，最多 7 个");
      return;
    }

    setFormData({ interests: finalInterests });
    onNext();
  };

  return (
    <div className="w-full max-w-md max-h-[90vh] overflow-auto flex flex-col justify-start items-center text-center px-4 pt-3 pb-4 gap-2 text-sm leading-snug">
      <div className="font-medium text-gray-800">
        你的兴趣爱好有哪些？
      </div>

      <div className="w-full">
        {!selectedMain ? (
          <MainInterestSelector
            options={mainOptions}
            onSelect={handleMainSelect}
            selected={selectedMain}
          />
        ) : (
          <div className="w-full flex flex-col items-center gap-3">
            <button
              onClick={() => setSelectedMain("")}
              className="text-xs text-gray-500 hover:text-indigo-500 transition underline self-start"
            >
              ← 返回
            </button>

            {selectedMain === "其他" ? (
              <CustomInterestInput
                value={customText}
                onChange={(val) => {
                  setCustomText(val);
                  onError?.("interests", "");
                }}
                onAdd={(val) => {
                  const trimmed = val.trim();
                  if (!trimmed || selectedSubs.includes(trimmed) || selectedSubs.length >= 7) return;
                  setFormData({ interests: [...selectedSubs, trimmed] });
                  setCustomText("");
                  onError?.("interests", "");
                }}
                disabledAdd={
                  !customText.trim() ||
                  selectedSubs.includes(customText.trim()) ||
                  selectedSubs.length >= 7
                }
                error={errors?.interests}
              />
            ) : (
              <SubInterestSelector
                options={subOptionsMap[selectedMain] || []}
                selected={selectedSubs}
                onToggle={handleSubToggle}
              />
            )}
          </div>
        )}

        <SelectedTags items={selectedSubs} onRemove={handleSubToggle} />

        {errors?.interests && (
          <p className="text-xs text-orange-500 mt-1">{errors.interests}</p>
        )}

         {/* 按钮 */}
        <button onClick={handleNext} className="mt-2">
          <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-1" />
        </button>
      </div>
    </div>
  );
}
