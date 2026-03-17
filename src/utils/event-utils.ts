import type { EventData, EventParticipant } from '@app-types';

/**
 * Calculates the total number of spots filled for an event, including guests.
 * Sums (1 + guestCount) for each participant.
 * Fallbacks to eventTotalAttendNumber or spotsBooked if participants list is missing.
 */
export const calculateSpotsFilled = (
  event: Partial<EventData>,
  currentUserId?: number,
  guestsCountState?: number
): number => {
  const participants = event.participants || [];

  if (participants.length > 0) {
    return participants.reduce((sum, p) => {
      // Determine guest count from possible fields
      const gCount = (p as any).guestCount ?? (p as any).guest_count ?? 0;

      // If this is the current user and they have joined, we can use the local guestsCount state 
      // if it's more up-to-date than the participant list (useful during/immediately after booking)
      let pCount = 1 + gCount;
      if (currentUserId && p.userId === currentUserId && guestsCountState !== undefined) {
        // If user is joined, their total group size in spots is guestsCountState
        // (Note: in EventDetailsScreen, guestsCountState represents total people for the booking)
        pCount = Math.max(pCount, guestsCountState);
      }

      return sum + pCount;
    }, 0);
  }

  // Fallback to aggregate fields if no participant list is available
  return event.eventTotalAttendNumber ?? event.spotsInfo?.spotsBooked ?? 0;
};
