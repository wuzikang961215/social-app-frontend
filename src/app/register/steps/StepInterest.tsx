"use client";
import { useState } from "react";
import { StepProps } from "../page";
import { motion, AnimatePresence } from "framer-motion";
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
  const [hasClickedIntro, setHasClickedIntro] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

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
    <div
      className="w-full max-w-md h-[365px] flex flex-col justify-start items-center text-center px-4 pt-3 pb-6 gap-2"
      onClick={() => {
        if (!hasClickedIntro) {
          setHasClickedIntro(true);
          setTimeout(() => setShowMainContent(true), 1000);
        }
      }}
    >
      <div className="text-base font-medium text-gray-800 leading-relaxed">
        我们想了解你的兴趣喜好，帮你找到更合拍的朋友。
      </div>

      <AnimatePresence>
        {hasClickedIntro && (
          <motion.div
            className="text-base text-gray-800 font-medium"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            你的爱好是？
          </motion.div>
        )}
      </AnimatePresence>

      {hasClickedIntro && showMainContent && (
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!selectedMain ? (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MainInterestSelector options={mainOptions} onSelect={handleMainSelect} selected={selectedMain} />
              </motion.div>
            ) : (
              <motion.div
                key="sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <button
                  onClick={() => setSelectedMain("")}
                  className="text-sm text-gray-500 hover:text-indigo-500 transition underline mb-2"
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
              </motion.div>
            )}
          </AnimatePresence>

          <SelectedTags items={selectedSubs} onRemove={handleSubToggle} />

          {errors?.interests && (
            <p className="text-sm text-orange-500 mt-1">{errors.interests}</p>
          )}

          <button onClick={handleNext}>
            <ArrowRightCircle className="w-8 h-8 text-indigo-500 hover:scale-110 transition mt-3" />
          </button>
        </div>
      )}
    </div>
  );
}
