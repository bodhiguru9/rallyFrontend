import { useMemo } from 'react';
import type { PlayerBooking } from '@services/booking-service';
import type { CalendarTab } from '../OrganiserCalendarScreen.types';

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

const GST_TIME_ZONE = 'Asia/Dubai';

const getDateKeyInTimeZone = (input: Date | string, timeZone: string): string => {
  const date = typeof input === 'string' ? new Date(input) : input;
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value || '';
  const month = parts.find((part) => part.type === 'month')?.value || '';
  const day = parts.find((part) => part.type === 'day')?.value || '';

  return `${year}-${month}-${day}`;
};

/**
 * Hook to filter and group organiser events by date and tab.
 * Mirrors the player calendar's useGroupedEvents logic.
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
      const selectedDateKey = getDateKeyInTimeZone(selectedDate, GST_TIME_ZONE);
      filteredEvents = events.filter((event) => {
        const eventDateKey = getDateKeyInTimeZone(event.eventDateTime, GST_TIME_ZONE);
        return eventDateKey === selectedDateKey;
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
        const dateKey = getDateKeyInTimeZone(event.eventDateTime, GST_TIME_ZONE);
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
