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

/** Advance a date by one period based on frequency string (e.g. 'weekly', 'daily') */
const advanceByFrequency = (date: Date, frequency: string): Date => {
  const next = new Date(date);
  const f = (frequency || '').toLowerCase();
  if (f.includes('daily')) {
    next.setDate(next.getDate() + 1);
  } else if (f.includes('weekly')) {
    next.setDate(next.getDate() + 7);
  } else if (f.includes('biweekly') || f.includes('bi-weekly')) {
    next.setDate(next.getDate() + 14);
  } else if (f.includes('monthly')) {
    next.setMonth(next.getMonth() + 1);
  } else {
    // Unknown frequency — weekly as safe fallback
    next.setDate(next.getDate() + 7);
  }
  return next;
};

/**
 * Given a recurring PlayerBooking, generate virtual PlayerBooking entries for every
 * occurrence between now and eventFrequencyEndDate.
 * Each occurrence is a shallow clone with overridden eventDateTime/eventEndDateTime.
 * The `_occurrenceStart` and `_occurrenceEnd` fields carry ISO strings the CalendarScreen
 * will pass as route params when navigating to EventDetails → BookingModal.
 */
const expandRecurringBooking = (booking: PlayerBooking): PlayerBooking[] => {
  const frequencies = booking.eventFrequency;
  const endDate = booking.eventFrequencyEndDate ? new Date(booking.eventFrequencyEndDate) : null;

  if (!frequencies || frequencies.length === 0 || !endDate) {
    return [booking]; // not recurring or no end date — return as-is
  }

  const frequency = frequencies[0]; // use first frequency value
  const entries: PlayerBooking[] = [];

  // Duration of one session (for computing occurrenceEnd)
  const sessionStart = new Date(booking.eventDateTime);
  const sessionEnd = booking.eventEndDateTime ? new Date(booking.eventEndDateTime) : null;
  const durationMs = sessionEnd ? sessionEnd.getTime() - sessionStart.getTime() : 0;

  let occStart = sessionStart;
  const bookedOccurrenceStart = (booking.booking as any)?.occurrenceStart as string | null | undefined;

  while (occStart <= endDate) {
    const occEnd = durationMs > 0 ? new Date(occStart.getTime() + durationMs) : null;
    const occStartIso = occStart.toISOString();
    const isThisOccurrenceBooked =
      // The first occurrence booking from the parent booking
      (occStart.getTime() === sessionStart.getTime() && !bookedOccurrenceStart) ||
      // A specific occurrence booking
      (bookedOccurrenceStart && new Date(bookedOccurrenceStart).getTime() === occStart.getTime());

    if (isThisOccurrenceBooked) {
      const virtualEntry: PlayerBooking = {
        ...booking,
        // Override dates so EventCard and calendar grouping use the right occurrence date
        eventDateTime: occStartIso,
        eventEndDateTime: occEnd ? occEnd.toISOString() : booking.eventEndDateTime,
        // Carry occurrence metadata for CalendarScreen navigation
        // We'll use these to pass to the booking API
        booking: {
          ...booking.booking,
          occurrenceStart: occStartIso,
          occurrenceEnd: occEnd ? occEnd.toISOString() : null,
          // If this is the booked occurrence, keep status; otherwise treat as unbooked
          bookingStatus: isThisOccurrenceBooked ? booking.booking.bookingStatus : 'upcoming',
          bookingId: isThisOccurrenceBooked ? booking.booking.bookingId : null,
        },
        isJoined: isThisOccurrenceBooked ? booking.isJoined : false,
      };

      // Add a unique identifier for the virtual entry to avoid key collisions
      (virtualEntry as any).occurrenceId = `${booking.eventId}_${occStartIso}`;

      entries.push(virtualEntry);
    }
    occStart = advanceByFrequency(occStart, frequency);
  }

  return entries;
};

export const useGroupedEvents = ({
  events,
  activeTab,
  selectedDate,
}: UseGroupedEventsProps): GroupedEventsResult => {
  return useMemo(() => {
    // Expand recurring bookings into per-occurrence virtual entries
    const expandedEvents: PlayerBooking[] = events.flatMap((event) =>
      event.eventFrequency && event.eventFrequency.length > 0
        ? expandRecurringBooking(event)
        : [event],
    );

    // Filter events by selected date if provided
    let filteredEvents = expandedEvents;
    if (selectedDate) {
      filteredEvents = expandedEvents.filter((event) => {
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
      const isCancelled = event.booking.bookingStatus === 'cancelled' || event.eventStatus === 'cancelled';
      let isLocalPast = false;
      if (isCancelled) {
        isLocalPast = true;
      } else if (event.eventEndDateTime) {
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
