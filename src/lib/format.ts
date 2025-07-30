export const formatTimeRange = (start: string, duration: number) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    
    // Parse the time string treating it as Sydney local time
    // Expected format: "YYYY-MM-DDTHH:mm"
    const startDate = new Date(start + ':00+10:00'); // Assume AEST
    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    // Extract time parts directly
    const formatTime = (d: Date) => {
      const hours = d.getHours();
      const minutes = d.getMinutes();
      return `${pad(hours)}:${pad(minutes)}`;
    };
  
    // Get date prefix
    const now = new Date();
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayDiff = Math.floor((startDateOnly.getTime() - nowDateOnly.getTime()) / 86400000);
  
    // Chinese weekday names
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[startDate.getDay()];
  
    let prefix;
    if (dayDiff === 0) {
      prefix = "今天";
    } else if (dayDiff === 1) {
      prefix = "明天";
    } else if (dayDiff === 2) {
      prefix = "后天";
    } else {
      // Chinese format: MM月DD日 周X
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();
      prefix = `${month}月${day}日 ${weekday}`;
    }
  
    return `${prefix} ${formatTime(startDate)} - ${formatTime(endDate)}`;
  };
  