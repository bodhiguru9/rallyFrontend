import { useMemo } from 'react';
import type { PlayerBooking } from '@services/booking-service';
import type { CalendarTab } from '../OrganiserCalendarScreen.types';

interface UseGroupedEventsProps {
  events: PlayerBooking[];
  activeTab: CalendarTab;
}

interface GroupedEventsResult {
  upcomingEvents: PlayerBooking[];
  pastEvents: PlayerBooking[];
  groupedEvents: { [key: string]: PlayerBooking[] };
}

/**
 * Hook to filter and group organiser events by date and tab.
 * Upcoming tab: events with eventStatus === 'upcoming'.
 * Past tab: events with eventStatus === 'past' or 'ongoing' (past + ongoing together).
 */
export const useGroupedEvents = ({
  events,
  activeTab,
}: UseGroupedEventsProps): GroupedEventsResult => {
  return useMemo(() => {
    const upcoming: PlayerBooking[] = [];
    const past: PlayerBooking[] = [];

    events.forEach((event) => {
      const status = event.eventStatus?.toLowerCase() ?? (new Date(event.eventDateTime) >= new Date() ? 'upcoming' : 'past');
      if (status === 'upcoming') {
        upcoming.push(event);
      } else {
        // Past tab shows both past and ongoing events
        past.push(event);
      }
    });

    const groupByDate = (eventList: PlayerBooking[]) => {
      const grouped: { [key: string]: PlayerBooking[] } = {};
      eventList.forEach((event) => {
        const eventDate = new Date(event.eventDateTime);
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, '0');
        const day = String(eventDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      });
      Object.keys(grouped).forEach((key) => {
        grouped[key].sort((a, b) => {
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
  }, [events, activeTab]);
};
