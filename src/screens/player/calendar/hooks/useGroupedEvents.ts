import { useMemo } from 'react';
import type { PlayerBooking } from '@services/booking-service';
import type { CalendarTab } from '../CalendarScreen.types';

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

export const useGroupedEvents = ({
  events,
  activeTab,
  selectedDate,
}: UseGroupedEventsProps): GroupedEventsResult => {
  return useMemo(() => {
    // Filter events by selected date if provided
    let filteredEvents = events;
    if (selectedDate) {
      filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.eventDateTime);
        return (
          eventDate.getFullYear() === selectedDate.getFullYear() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getDate() === selectedDate.getDate()
        );
      });
    }

    const upcoming: PlayerBooking[] = [];
    const past: PlayerBooking[] = [];

    const now = new Date();

    // Use local time comparison to determine if event is past
    filteredEvents.forEach((event) => {
      let isLocalPast = false;
      if (event.eventEndDateTime) {
        isLocalPast = new Date(event.eventEndDateTime) < now;
      } else {
        // Fallback: assume 1 hour duration if end time missing
        const implicitEnd = new Date(new Date(event.eventDateTime).getTime() + 60 * 60 * 1000);
        isLocalPast = implicitEnd < now;
      }

      if (isLocalPast) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });

    // Group events by date
    const groupByDate = (eventList: PlayerBooking[]) => {
      const grouped: { [key: string]: PlayerBooking[] } = {};
      eventList.forEach((event) => {
        const eventDate = new Date(event.eventDateTime);
        // Use YYYY-MM-DD format for consistent sorting
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, '0');
        const day = String(eventDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      });
      // Sort events within each date group by time
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => {
          if (activeTab === 'past') {
            return b.eventDateTime.localeCompare(a.eventDateTime);
          }
          return new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime();
        });
      });
      return grouped;
    };

    const activeEvents = activeTab === 'upcoming' ? upcoming : past;
    const grouped = groupByDate(activeEvents);

    return {
      upcomingEvents: upcoming,
      pastEvents: past,
      groupedEvents: grouped,
    };
  }, [events, activeTab, selectedDate]);
};
