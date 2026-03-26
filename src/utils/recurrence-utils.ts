/**
 * Utilities for recurring events.
 * eventFrequency format: ['daily'] | ['weekly'] | ['weekly', 'mon', 'tue', ...] | ['monthly'] | ['yearly'] | ['custom', value]
 * Day abbreviations: sun, mon, tue, wed, thu, fri, sat (0=Sun, 1=Mon, ..., 6=Sat)
 */

import { parseLocalDate } from '@utils/date-utils';

const DAY_ABBREVS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export interface EventWithRecurrence {
  eventDateTime: string;
  eventFrequency?: string[];
  /** Recurrence end date (YYYY-MM-DD); undefined = recur forever */
  eventFrequencyEndDate?: string | null;
}

/**
 * Check if an event has recurrence configured
 */
export function isRecurringEvent(event: EventWithRecurrence): boolean {
  const freq = event.eventFrequency;
  return !!(freq && Array.isArray(freq) && freq.length > 0 && freq[0] !== 'custom');
}

/**
 * Get the recurrence end date as YYYY-MM-DD, or null if never ends.
 */
function getRecurrenceEndDate(event: EventWithRecurrence): string | null {
  const end = event.eventFrequencyEndDate;
  if (!end || typeof end !== 'string') return null;
  return end.split('T')[0];
}

/**
 * Check if a recurring event occurs on a given date.
 * Respects eventFrequencyEndDate: events do not recur after that date.
 * @param event - Event with eventDateTime and eventFrequency
 * @param date - Date to check (Date object or ISO string)
 */
export function isRecurringEventOnDate(
  event: EventWithRecurrence,
  date: Date | string,
): boolean {
  const freq = event.eventFrequency;
  if (!freq || freq.length === 0 || freq[0] === 'custom') return false;

  const d = typeof date === 'string' ? parseLocalDate(date) : date;
  const eventStart = new Date(event.eventDateTime);
  const first = freq[0];

  // Filter out dates after recurrence end date (use local date for comparison)
  const endDateStr = getRecurrenceEndDate(event);
  if (endDateStr) {
    const checkDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (checkDateStr > endDateStr) return false;
  }

  if (first === 'daily') return true;

  if (first === 'weekly') {
    const weeklyDays = freq.slice(1).map((day) => {
      const s = String(day).toLowerCase();
      const idx = DAY_ABBREVS.indexOf(s);
      if (idx >= 0) return idx;
      const num = parseInt(s, 10);
      if (num >= 0 && num <= 6) return num;
      return -1;
    }).filter((i) => i >= 0);
    const targetDay = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    if (weeklyDays.length === 0) {
      return targetDay === eventStart.getDay();
    }
    return weeklyDays.includes(targetDay);
  }

  if (first === 'monthly') {
    return d.getDate() === eventStart.getDate();
  }

  if (first === 'yearly') {
    return d.getMonth() === eventStart.getMonth() && d.getDate() === eventStart.getDate();
  }

  return false;
}

/**
 * Get the effective datetime for a recurring event on a target date.
 * Combines the target date with the event's original time.
 */
export function getRecurringEventInstanceDateTime(
  event: EventWithRecurrence,
  targetDate: Date | string,
): string {
  const d = typeof targetDate === 'string' ? parseLocalDate(targetDate) : new Date(targetDate);
  const eventStart = new Date(event.eventDateTime);

  d.setHours(
    eventStart.getHours(),
    eventStart.getMinutes(),
    eventStart.getSeconds(),
    eventStart.getMilliseconds(),
  );
  return d.toISOString();
}

/**
 * Expand recurring events into virtual instances for each matching date in the range.
 * One-time events are returned as-is. Recurring events get one instance per matching date.
 * Respects eventFrequencyEndDate: no instances after that date.
 */
export function expandRecurringEvents<T extends EventWithRecurrence>(
  events: T[],
  dateStrings: string[],
): T[] {
  const result: T[] = [];

  for (const event of events) {
    if (!isRecurringEvent(event)) {
      result.push(event);
      continue;
    }

    for (const fullDate of dateStrings) {
      const d = parseLocalDate(fullDate);
      if (isRecurringEventOnDate(event, d)) {
        const instanceDateTime = getRecurringEventInstanceDateTime(event, d);
        result.push({
          ...event,
          eventDateTime: instanceDateTime,
        } as T);
      }
    }
  }

  return result;
}

/**
 * Expands recurring events from their start date (or recent past) up to maxMonthsFuture into the future
 * or their specified end date. Automatically sorts the result chronologically.
 */
export function expandEventsForward<T extends EventWithRecurrence>(
  events: T[],
  maxMonthsFuture: number = 2,
  maxMonthsPast: number = 2
): T[] {
  const result: T[] = [];
  const now = new Date();
  
  const pastLimit = new Date();
  pastLimit.setMonth(pastLimit.getMonth() - maxMonthsPast);
  pastLimit.setHours(0, 0, 0, 0);

  const futureLimit = new Date();
  futureLimit.setMonth(futureLimit.getMonth() + maxMonthsFuture);
  futureLimit.setHours(23, 59, 59, 999);

  for (const event of events) {
    if (!isRecurringEvent(event)) {
      result.push(event);
      continue;
    }

    const eventStart = new Date(event.eventDateTime);
    
    // We only want to generate instances starting from either the event start date OR the pastLimit, whichever is later.
    const startWindow = eventStart > pastLimit ? new Date(eventStart) : new Date(pastLimit);
    startWindow.setHours(0, 0, 0, 0);

    // End window is either the futureLimit (e.g. +2 months) or the event's actual recurrence end date, whichever is earlier.
    let endWindow = new Date(futureLimit);
    const freqEndStr = getRecurrenceEndDate(event);
    if (freqEndStr) {
      const freqEnd = new Date(freqEndStr);
      freqEnd.setHours(23, 59, 59, 999);
      if (freqEnd < endWindow) {
        endWindow = freqEnd;
      }
    }

    const currentDay = new Date(startWindow);
    const endMs = endWindow.getTime();
    
    // Safety limit to prevent extreme infinite loops (e.g. max 400 days)
    let iterations = 0;
    const MAX_ITERATIONS = 400; 
    
    while (currentDay.getTime() <= endMs && iterations < MAX_ITERATIONS) {
      if (isRecurringEventOnDate(event, currentDay)) {
        const instanceDateTime = getRecurringEventInstanceDateTime(event, currentDay);
        // Ensure the instance is entirely valid and on/after the real eventStart
        if (new Date(instanceDateTime) >= eventStart) {
          let newEndDateTime = (event as any).eventEndDateTime;
          if (newEndDateTime) {
            const durationMs = new Date(newEndDateTime).getTime() - eventStart.getTime();
            newEndDateTime = new Date(new Date(instanceDateTime).getTime() + durationMs).toISOString();
          }
          result.push({
            ...event,
            eventDateTime: instanceDateTime,
            eventEndDateTime: newEndDateTime,
          } as T);
        }
      }
      currentDay.setDate(currentDay.getDate() + 1);
      iterations++;
    }
  }

  return result.sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());
}
