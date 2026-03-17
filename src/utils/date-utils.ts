import moment from 'moment';

/**
 * Date formatting options for different variants
 */
export type DateFormatVariant =
  | 'date' // e.g., "24 Oct 2026"
  | 'date-long' // e.g., "October 24, 2026"
  | 'date-short' // e.g., "24/10/2026"
  | 'time' // e.g., "1:00 PM"
  | 'time-24h' // e.g., "13:00"
  | 'datetime' // e.g., "24 Oct 2026, 1:00 PM"
  | 'datetime-long' // e.g., "October 24, 2026 at 1:00 PM"
  | 'iso' // e.g., "2026-01-31T14:00:00.000Z"
  | 'display' // e.g., "Sat 21 Oct, 1:00 PM"
  | 'display-range'; // e.g., "Sat 21 Oct, 1:00 - 2:00 PM"

/**
 * Universal date formatter - converts timestamp to various format variants
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @param variant - The format variant to return
 * @param options - Additional options (e.g., endTime for range formats)
 * @returns Formatted date string
 *
 * @example
 * formatDate('2026-01-31T14:00:00.000Z', 'date') // "31 Jan 2026"
 * formatDate('2026-01-31T14:00:00.000Z', 'time') // "2:00 PM"
 * formatDate('2026-01-31T14:00:00.000Z', 'display') // "Sat 31 Jan, 2:00 PM"
 */
export const formatDate = (
  timestamp: string | Date | number,
  variant: DateFormatVariant = 'datetime',
  options?: {
    endTime?: string | Date | number; // For range formats
    locale?: string; // Locale for formatting (default: 'en-US')
    timeZone?: string; // IANA timezone (e.g., "Asia/Dubai")
  },
): string => {
  try {
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return typeof timestamp === 'string' ? timestamp : '';
    }

    const locale = options?.locale || 'en-US';
    const timeZone = options?.timeZone;

    switch (variant) {
      case 'date':
        // e.g., "24 Oct 2026"
        return date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone,
        });

      case 'date-long':
        // e.g., "October 24, 2026"
        return date.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone,
        });

      case 'date-short':
        // e.g., "24/10/2026"
        return date.toLocaleDateString(locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone,
        });

      case 'time':
        // e.g., "1:00 PM"
        return date.toLocaleTimeString(locale, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone,
        });

      case 'time-24h':
        // e.g., "13:00"
        return date.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone,
        });

      case 'datetime':
        // e.g., "24 Oct 2026, 1:00 PM"
        return `${formatDate(date, 'date', options)}, ${formatDate(date, 'time', options)}`;

      case 'datetime-long':
        // e.g., "October 24, 2026 at 1:00 PM"
        return `${formatDate(date, 'date-long', options)} at ${formatDate(date, 'time', options)}`;

      case 'iso':
        // e.g., "2026-01-31T14:00:00.000Z"
        return date.toISOString();

      case 'display':
        // e.g., "Sat 24 Oct, 1:00 PM"
        return formatDisplayDate(date, locale, timeZone);

      case 'display-range':
        // e.g., "Sat 24 Oct, 1:00 - 2:00 PM"
        return formatDisplayRange(date, options?.endTime, locale, timeZone);

      default:
        return formatDate(date, 'datetime', options);
    }
  } catch (error: unknown) {
    void error;
    return typeof timestamp === 'string' ? timestamp : '';
  }
};

const getPartValue = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) => {
  return parts.find((part) => part.type === type)?.value || '';
};

const formatDisplayDate = (date: Date, locale: string, timeZone?: string): string => {
  if (!timeZone) {
    return moment(date).format('ddd D MMM, h:mm A');
  }

  const parts = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).formatToParts(date);

  const weekday = getPartValue(parts, 'weekday');
  const day = getPartValue(parts, 'day');
  const month = getPartValue(parts, 'month');
  const hour = getPartValue(parts, 'hour');
  const minute = getPartValue(parts, 'minute');
  const dayPeriod = getPartValue(parts, 'dayPeriod').toUpperCase();

  return `${weekday} ${day} ${month}, ${hour}:${minute} ${dayPeriod}`;
};

const formatDisplayRange = (
  startDate: Date,
  endTime: string | Date | number | undefined,
  locale: string,
  timeZone?: string,
): string => {
  if (!timeZone) {
    const start = moment(startDate);
    const end = endTime ? moment(endTime) : moment(startDate).add(1, 'hour');

    const datePart = start.format('ddd D MMM');
    const startTimeStr = start.format('h:mm');
    const endTimeStr = end.format('h:mm A');

    return `${datePart}, ${startTimeStr} - ${endTimeStr}`;
  }

  const endDate = endTime ? new Date(endTime) : new Date(startDate.getTime() + 60 * 60 * 1000);

  const startParts = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).formatToParts(startDate);

  const endParts = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).formatToParts(endDate);

  const weekday = getPartValue(startParts, 'weekday');
  const day = getPartValue(startParts, 'day');
  const month = getPartValue(startParts, 'month');
  const startHour = getPartValue(startParts, 'hour');
  const startMinute = getPartValue(startParts, 'minute');
  const endHour = getPartValue(endParts, 'hour');
  const endMinute = getPartValue(endParts, 'minute');
  const endDayPeriod = getPartValue(endParts, 'dayPeriod').toUpperCase();

  return `${weekday} ${day} ${month}, ${startHour}:${startMinute} - ${endHour}:${endMinute} ${endDayPeriod}`;
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @returns Relative time string
 *
 * @example
 * getRelativeTime('2026-01-31T14:00:00.000Z') // "in 2 days"
 * getRelativeTime('2026-01-14T14:00:00.000Z') // "2 hours ago"
 */
export const getRelativeTime = (timestamp: string | Date | number): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return '';
    }

    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
    const absDiff = Math.abs(diffInSeconds);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    let value: number;
    let unit: string;

    if (absDiff < minute) {
      return diffInSeconds < 0 ? 'just now' : 'in a moment';
    } else if (absDiff < hour) {
      value = Math.floor(absDiff / minute);
      unit = value === 1 ? 'minute' : 'minutes';
    } else if (absDiff < day) {
      value = Math.floor(absDiff / hour);
      unit = value === 1 ? 'hour' : 'hours';
    } else if (absDiff < week) {
      value = Math.floor(absDiff / day);
      unit = value === 1 ? 'day' : 'days';
    } else if (absDiff < month) {
      value = Math.floor(absDiff / week);
      unit = value === 1 ? 'week' : 'weeks';
    } else if (absDiff < year) {
      value = Math.floor(absDiff / month);
      unit = value === 1 ? 'month' : 'months';
    } else {
      value = Math.floor(absDiff / year);
      unit = value === 1 ? 'year' : 'years';
    }

    return diffInSeconds < 0 ? `${value} ${unit} ago` : `in ${value} ${unit}`;
  } catch (error) {
    void error;
    return '';
  }
};

/**
 * Check if a date is today
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @returns True if the date is today
 */
export const isToday = (timestamp: string | Date | number): boolean => {
  try {
    const date = new Date(timestamp);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    void error;
    return false;
  }
};

/**
 * Check if a date is tomorrow
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @returns True if the date is tomorrow
 */
export const isTomorrow = (timestamp: string | Date | number): boolean => {
  try {
    const date = new Date(timestamp);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  } catch (error) {
    void error;
    return false;
  }
};

/**
 * Check if a date is in the past
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @returns True if the date is in the past
 */
export const isPast = (timestamp: string | Date | number): boolean => {
  try {
    const date = new Date(timestamp);
    const now = new Date();

    return date.getTime() < now.getTime();
  } catch (error) {
    void error;
    return false;
  }
};

/**
 * Check if a date is in the future
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @returns True if the date is in the future
 */
export const isFuture = (timestamp: string | Date | number): boolean => {
  try {
    const date = new Date(timestamp);
    const now = new Date();

    return date.getTime() > now.getTime();
  } catch (error) {
    void error;
    return false;
  }
};

/**
 * Add time to a date
 * @param timestamp - ISO 8601 string, Date object, or timestamp number
 * @param amount - Amount to add
 * @param unit - Unit of time to add
 * @returns New date with time added
 */
export const addTime = (
  timestamp: string | Date | number,
  amount: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years',
): Date => {
  const date = new Date(timestamp);

  switch (unit) {
    case 'seconds':
      date.setSeconds(date.getSeconds() + amount);
      break;
    case 'minutes':
      date.setMinutes(date.getMinutes() + amount);
      break;
    case 'hours':
      date.setHours(date.getHours() + amount);
      break;
    case 'days':
      date.setDate(date.getDate() + amount);
      break;
    case 'weeks':
      date.setDate(date.getDate() + amount * 7);
      break;
    case 'months':
      date.setMonth(date.getMonth() + amount);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + amount);
      break;
  }

  return date;
};

/**
 * Get the difference between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Unit to return the difference in
 * @returns Difference in the specified unit
 */
export const getDateDifference = (
  date1: string | Date | number,
  date2: string | Date | number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years',
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const diffInMs = Math.abs(d2.getTime() - d1.getTime());

  switch (unit) {
    case 'seconds':
      return Math.floor(diffInMs / 1000);
    case 'minutes':
      return Math.floor(diffInMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffInMs / (1000 * 60 * 60));
    case 'days':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    case 'weeks':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    case 'months':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
    case 'years':
      return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365));
    default:
      return 0;
  }
};

// ============================================================================
// LOCAL DATE HELPERS (Timezone-safe for recurring events)
// ============================================================================

/**
 * Get YYYY-MM-DD from a date in local timezone (avoids UTC shift issues).
 */
export const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Parse a date string to local Date. Handles YYYY-MM-DD as local date (not UTC midnight).
 */
export const parseLocalDate = (str: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(str);
};

// ============================================================================
// DATE FILTER GENERATION (For DateFilter component)
// ============================================================================

/**
 * Generate date filters for the DateFilter component
 * @param startDate - Starting date (defaults to today)
 * @param count - Number of dates to generate
 * @param selectedDate - Date to mark as selected (defaults to today)
 * @returns Array of DateFilter objects
 *
 * @example
 * generateDateFilters(new Date(), 30) // Generate 30 days from today
 */
export const generateDateFilters = (
  startDate: Date = new Date(),
  count: number = 30,
  selectedDate?: number,
): Array<{
  date: number;
  day: string;
  month: string;
  isSelected: boolean;
  fullDate: string;
}> => {
  const filters: Array<{
    date: number;
    day: string;
    month: string;
    isSelected: boolean;
    fullDate: string;
  }> = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    date.setHours(0, 0, 0, 0); // Normalize to start of day

    const dateNum = date.getDate();

    filters.push({
      date: dateNum,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isSelected: selectedDate !== undefined ? dateNum === selectedDate : false,
      fullDate: toLocalDateString(date),
    });
  }

  return filters;
};

/**
 * Get the maximum end date (6 months from today)
 * @returns Date object representing 6 months from today
 */
export const getMaxDateFilterEndDate = (): Date => {
  const today = new Date();
  return addTime(today, 6, 'months');
};

/**
 * Check if we can load more dates
 * @param currentEndDate - Current end date
 * @returns True if more dates can be loaded (within 6 months from today)
 */
export const canLoadMoreDates = (currentEndDate: Date): boolean => {
  const maxDate = getMaxDateFilterEndDate();
  return currentEndDate < maxDate;
};

// ============================================================================
// LEGACY FUNCTIONS (Kept for backward compatibility)
// ============================================================================

/**
 * @deprecated Use formatDate(timestamp, 'display-range') instead
 * Transforms an ISO date string to a formatted date and time range
 * @param isoDateString - ISO 8601 date string (e.g., "2026-01-11T17:00:00.000Z")
 * @returns Formatted string (e.g., "Sat 24 Oct, 1:00 - 2:00 PM")
 */
export const transformTime = (isoDateString: string): string => {
  return formatDate(isoDateString, 'display-range');
};

/**
 * Format per-player booking slot for Members tab (e.g., "23 Oct, 4:00 - 6:30 PM")
 * Use when backend sends slotStartTime/slotEndTime per participant
 * @param slotStartTime - ISO 8601 start time
 * @param slotEndTime - Optional ISO 8601 end time (falls back to start + 1hr if missing)
 */
export const formatBookingSlot = (
  slotStartTime: string | Date | number,
  slotEndTime?: string | Date | number,
): string => {
  try {
    const start = moment(slotStartTime);
    const end = slotEndTime ? moment(slotEndTime) : moment(slotStartTime).add(1, 'hour');
    const datePart = start.format('D MMM');
    const startTimeStr = start.format('h:mm');
    const endTimeStr = end.format('h:mm A');
    return `${datePart}, ${startTimeStr} - ${endTimeStr}`;
  } catch {
    return '';
  }
};
