import type { EventData } from '@app-types';
import type { PlayerBooking } from '@services/booking-service';

/**
 * Adapts EventData to PlayerBooking format
 * for use with existing calendar components
 */
export const adaptEventDataToPlayerBooking = (event: EventData): PlayerBooking => {
  const now = new Date();
  const eventDate = new Date(event.eventDateTime);
  const isPast = eventDate < now;

  return {
    ...event,
    // Add booking-specific fields that EventData doesn't have
    booking: {
      bookingId: null,
      joinedAt: event.createdAt,
      bookingStatus: isPast ? ('past' as const) : ('upcoming' as const),
      bookingStatusValue: null,
      isPast,
      isOngoing: false,
      isUpcoming: !isPast,
    },
    // Ensure isJoined is set (organiser is always "joined" to their own events)
    isJoined: true,
    // Ensure these fields have default values if null
    eventMinAge: event.eventMinAge ?? 0,
    eventMaxAge: event.eventMaxAge ?? 100,
  } as PlayerBooking;
};
