import { useMemo } from 'react';
import type { PlayerBooking } from '@services/booking-service';
import type { CalendarTab } from '../OrganiserCalendarScreen.types';
import {
  isRecurringEvent,
  isRecurringEventOnDate,
  getRecurringEventInstanceDateTime,
} from '@utils/recurrence-utils';

interface UseGroupedEventsProps {
  events: PlayerBooking[];
  activeTab: CalendarTab;
  selectedDate?: Date | null;
}

interface GroupedEventsResult {
  upcomingEvents: PlayerBooking[];
  pastEvents: PlayerBooking[];
  groupedEvents: { [key: string]: PlayerBooking[] };
}

/** Get YYYY-MM-DD in local timezone for consistent date grouping */
const getLocalDateKey = (input: Date | string): string => {
  const date = typeof input === 'string' ? new Date(input) : input;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Hook to filter and group organiser events by date and tab.
 * Mirrors the player calendar's useGroupedEvents logic.
 * Supports recurring events: when a date is selected, recurring events that occur
 * on that date are included (e.g. "Every Tuesday" shows on each Tuesday).
 */
export const useGroupedEvents = ({
  events,
  activeTab,
  selectedDate,
}: UseGroupedEventsProps): GroupedEventsResult => {
  return useMemo(() => {
    // Filter events by selected date if provided
    let filteredEvents = events;
    if (selectedDate) {
      const selectedDateKey = getLocalDateKey(selectedDate);
      filteredEvents = events
        .filter((event) => {
          if (isRecurringEvent(event)) {
            return isRecurringEventOnDate(event, selectedDate);
          }
          const eventDateKey = getLocalDateKey(event.eventDateTime);
          return eventDateKey === selectedDateKey;
        })
        .map((event) => {
          // For recurring events on selected date, use the instance datetime for correct display
          if (isRecurringEvent(event) && isRecurringEventOnDate(event, selectedDate)) {
            return {
              ...event,
              eventDateTime: getRecurringEventInstanceDateTime(event, selectedDate),
            };
          }
          return event;
        });
    }

    const upcoming: PlayerBooking[] = [];
    const past: PlayerBooking[] = [];

    // Use booking.isPast flag (set by the adapter)
    filteredEvents.forEach((event) => {
      if (event.booking.isPast) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });

    // Group events by date
    const groupByDate = (eventList: PlayerBooking[]) => {
      const grouped: { [key: string]: PlayerBooking[] } = {};
      eventList.forEach((event) => {
        const dateKey = getLocalDateKey(event.eventDateTime);
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      });
      // Sort events within each date group by time
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => {
          const timeA = new Date(a.eventDateTime).getTime();
          const timeB = new Date(b.eventDateTime).getTime();
          if (activeTab === 'past') {
            return timeB - timeA;
          }
          return timeA - timeB;
        });
      });
      return grouped;
    };

    const activeEvents = (activeTab === 'upcoming' ? upcoming : past).sort((a, b) => {
      const timeA = new Date(a.eventDateTime).getTime();
      const timeB = new Date(b.eventDateTime).getTime();
      return activeTab === 'past' ? timeB - timeA : timeA - timeB;
    });
    const grouped = groupByDate(activeEvents);

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
      groupedEvents: grouped,
    };
  }, [events, activeTab, selectedDate]);
};
