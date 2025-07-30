// Simple date formatting for profile display
export const formatSimpleDate = (dateString: string): string => {
  // Input could be: "YYYY-MM-DDTHH:mm" or full Date string
  // Output format: "2025年6月21日 11:30"
  
  if (!dateString) return '';
  
  // First try to extract from ISO format
  let match = dateString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  
  if (!match) {
    // If that fails, try to parse as Date string
    // Example: "Sat Jun 21 2025 11:30:00 GMT+1000"
    const dateObj = new Date(dateString);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      
      // Chinese format: YYYY年MM月DD日 HH:mm
      return `${year}年${month}月${day}日 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    return dateString; // Return as-is if can't parse
  }
  
  const [, year, month, day, hours, minutes] = match;
  
  // Chinese format without leading zeros for month/day
  return `${year}年${parseInt(month)}月${parseInt(day)}日 ${hours}:${minutes}`;
};

// Even simpler format for year-month-day
export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return '';
  
  const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateString;
  
  const [, year, month, day] = match;
  return `${year}/${month}/${day}`;
};