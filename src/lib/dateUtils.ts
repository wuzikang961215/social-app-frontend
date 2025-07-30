/**
 * Date utilities for consistent Sydney timezone handling
 * All dates are stored as Sydney local time strings (YYYY-MM-DDTHH:mm)
 */

/**
 * Parse a Sydney time string to a Date object
 * The input string represents the exact time shown in Sydney
 */
export function parseSydneyTime(timeString: string): Date {
  if (!timeString) return new Date();
  
  // Handle different formats
  if (timeString.includes('GMT') || timeString.includes('Z')) {
    // If it's already a full date string, just parse it
    return new Date(timeString);
  }
  
  // For YYYY-MM-DDTHH:mm format, treat as Sydney local time
  // Add seconds if not present
  const normalizedString = timeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/) 
    ? timeString + ':00+10:00' // Assume AEST (UTC+10)
    : timeString;
  
  return new Date(normalizedString);
}

/**
 * Format a date to display in Sydney timezone
 */
export function formatSydneyTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseSydneyTime(date) : date;
  
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(dateObj).replace(',', '');
}

/**
 * Check if an event has started (Sydney time)
 */
export function hasEventStarted(startTime: string): boolean {
  const now = new Date();
  const eventStart = parseSydneyTime(startTime);
  return now >= eventStart;
}

/**
 * Check if an event has expired (Sydney time)
 */
export function hasEventExpired(startTime: string, durationMinutes: number): boolean {
  const now = new Date();
  const eventStart = parseSydneyTime(startTime);
  const eventEnd = new Date(eventStart.getTime() + durationMinutes * 60000);
  return now >= eventEnd;
}

/**
 * Get Sydney timezone offset
 */
export function getSydneyOffset(): string {
  const now = new Date();
  const sydneyTime = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    timeZoneName: 'short'
  }).format(now);
  
  // Extract timezone abbreviation (AEST or AEDT)
  const match = sydneyTime.match(/([A-Z]{3,4})$/);
  return match ? match[1] : 'AEST';
}