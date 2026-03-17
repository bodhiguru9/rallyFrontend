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
  // Fallback to aggregate fields if no participant list is available
  const aggregateCount = event.eventTotalAttendNumber ?? event.spotsInfo?.spotsBooked ?? 0;
  
  // If we have participants, use the higher of the two (in case list is incomplete from analytics)
  if (participants.length > 0) {
    const participantsListCount = participants.reduce((sum, p) => {
      const gCount = (p as any).guestCount ?? (p as any).guest_count ?? 0;
      let pCount = 1 + gCount;
      if (currentUserId && p.userId === currentUserId && guestsCountState !== undefined) {
        pCount = Math.max(pCount, guestsCountState);
      }
      return sum + pCount;
    }, 0);
    return Math.max(participantsListCount, aggregateCount);
  }

  return aggregateCount;
};
