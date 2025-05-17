export const formatTimeRange = (start: string, duration: number) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const format = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + duration * 60000);
  
    const now = new Date();
    const startStr = startDate.toDateString();
    const nowStr = now.toDateString();
  
    const prefix =
      startStr === nowStr
        ? "今天"
        : startStr === new Date(now.getTime() + 86400000).toDateString()
        ? "明天"
        : startStr === new Date(now.getTime() + 2 * 86400000).toDateString()
        ? "后天"
        : startDate.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
  
    return `${prefix} ${format(startDate)} - ${format(endDate)}`;
  };
  