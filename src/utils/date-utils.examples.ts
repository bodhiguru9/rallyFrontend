/**
 * Date Utilities - Usage Examples
 *
 * This file demonstrates all available date formatting functions.
 * Import these utilities in your components using:
 *
 * import { formatDate, getRelativeTime, isToday, ... } from '@utils';
 */

import {
  formatDate,
  getRelativeTime,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  addTime,
  getDateDifference,
} from './date-utils';

// Example timestamp
const exampleTimestamp = '2026-01-31T14:00:00.000Z';

/**
 * FORMAT DATE EXAMPLES
 */

// Date only formats
console.log(formatDate(exampleTimestamp, 'date'));
// Output: "31 Jan 2026"

console.log(formatDate(exampleTimestamp, 'date-long'));
// Output: "January 31, 2026"

console.log(formatDate(exampleTimestamp, 'date-short'));
// Output: "31/01/2026"

// Time only formats
console.log(formatDate(exampleTimestamp, 'time'));
// Output: "2:00 PM"

console.log(formatDate(exampleTimestamp, 'time-24h'));
// Output: "14:00"

// Date and time formats
console.log(formatDate(exampleTimestamp, 'datetime'));
// Output: "31 Jan 2026, 2:00 PM"

console.log(formatDate(exampleTimestamp, 'datetime-long'));
// Output: "January 31, 2026 at 2:00 PM"

// Display formats (commonly used in UI)
console.log(formatDate(exampleTimestamp, 'display'));
// Output: "Sat 31 Jan, 2:00 PM"

console.log(formatDate(exampleTimestamp, 'display-range'));
// Output: "Sat 31 Jan, 2:00 - 3:00 PM" (default 1 hour range)

console.log(
  formatDate(exampleTimestamp, 'display-range', {
    endTime: '2026-01-31T16:00:00.000Z',
  }),
);
// Output: "Sat 31 Jan, 2:00 - 4:00 PM" (custom end time)

// ISO format
console.log(formatDate(exampleTimestamp, 'iso'));
// Output: "2026-01-31T14:00:00.000Z"

/**
 * RELATIVE TIME EXAMPLES
 */

const pastDate = '2026-01-14T10:00:00.000Z';
const futureDate = '2026-01-17T10:00:00.000Z';

console.log(getRelativeTime(pastDate));
// Output: "2 hours ago" (varies based on current time)

console.log(getRelativeTime(futureDate));
// Output: "in 2 days" (varies based on current time)

/**
 * DATE CHECKING EXAMPLES
 */

const todayDate = new Date().toISOString();
const tomorrowDate = addTime(new Date(), 1, 'days').toISOString();

console.log(isToday(todayDate));
// Output: true

console.log(isTomorrow(tomorrowDate));
// Output: true

console.log(isPast('2025-01-01T00:00:00.000Z'));
// Output: true

console.log(isFuture('2027-01-01T00:00:00.000Z'));
// Output: true

/**
 * DATE MANIPULATION EXAMPLES
 */

// Add time
const nextWeek = addTime(new Date(), 7, 'days');
console.log(formatDate(nextWeek, 'date'));
// Output: Date 7 days from now

const nextMonth = addTime(new Date(), 1, 'months');
console.log(formatDate(nextMonth, 'date-long'));
// Output: Date 1 month from now

// Get difference between dates
const date1 = '2026-01-01T00:00:00.000Z';
const date2 = '2026-01-31T00:00:00.000Z';

console.log(getDateDifference(date1, date2, 'days'));
// Output: 30

console.log(getDateDifference(date1, date2, 'weeks'));
// Output: 4

console.log(getDateDifference(date1, date2, 'months'));
// Output: 1

/**
 * COMPONENT USAGE EXAMPLES
 */

// Example 1: Event Card Component
const EventCardExample = () => {
  const eventDate = '2026-02-15T18:00:00.000Z';

  return {
    displayDate: formatDate(eventDate, 'display-range'),
    // Output: "Sat 15 Feb, 6:00 - 7:00 PM"

    relativeTime: getRelativeTime(eventDate),
    // Output: "in 31 days"

    isUpcoming: isFuture(eventDate),
    // Output: true
  };
};

// Example 2: Calendar View
const CalendarViewExample = () => {
  const events = [
    { id: 1, date: new Date().toISOString() },
    { id: 2, date: addTime(new Date(), 1, 'days').toISOString() },
    { id: 3, date: '2026-02-01T10:00:00.000Z' },
  ];

  return events.map((event) => ({
    id: event.id,
    displayDate: formatDate(event.date, 'date'),
    isToday: isToday(event.date),
    isTomorrow: isTomorrow(event.date),
    relativeTime: getRelativeTime(event.date),
  }));
};

// Example 3: Event Details Screen
const EventDetailsExample = () => {
  const event = {
    startTime: '2026-02-20T14:00:00.000Z',
    endTime: '2026-02-20T16:00:00.000Z',
  };

  return {
    fullDateTime: formatDate(event.startTime, 'datetime-long'),
    // Output: "February 20, 2026 at 2:00 PM"

    timeRange: `${formatDate(event.startTime, 'time')} - ${formatDate(event.endTime, 'time')}`,
    // Output: "2:00 PM - 4:00 PM"

    duration: getDateDifference(event.startTime, event.endTime, 'hours'),
    // Output: 2

    daysUntil: getDateDifference(new Date(), event.startTime, 'days'),
    // Output: Number of days until event
  };
};

/**
 * LEGACY FUNCTION (Backward Compatibility)
 */

// Output: "Sat 31 Jan, 2:00 - 3:00 PM"
// Note: Use formatDate(timestamp, 'display-range') instead

export { EventCardExample, CalendarViewExample, EventDetailsExample };
