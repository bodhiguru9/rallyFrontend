import type { EventData, EventParticipant } from '@app-types';

/** Extract guest count from participant (matches MembersTab allParticipants logic) */
function getParticipantGuestCount(p: any): number {
  const raw = p;
  const flat = raw.user ? { ...raw.user, ...raw } : { ...raw };
  const booking = raw.booking ?? raw.bookingDetails ?? {};
  const guestCountRaw =
    flat.guestCount ??
    flat.guest_count ??
    flat.guests ??
    flat.guestsCount ??
    flat.guests_count ??
    booking.guestCount ??
    booking.guest_count ??
    booking.guests ??
    booking.guestsCount ??
    booking.guests_count;
  if (typeof guestCountRaw === 'number') return guestCountRaw;
  if (typeof flat.eventTotalAttendNumber === 'number' && flat.eventTotalAttendNumber > 1) {
    return flat.eventTotalAttendNumber - 1;
  }
  if (typeof booking.eventTotalAttendNumber === 'number' && booking.eventTotalAttendNumber > 1) {
    return booking.eventTotalAttendNumber - 1;
  }
  return 0;
}

/** Check if participant is cancelled (exclude from spots count) */
function isCancelled(p: any): boolean {
  const status = p?.bookingStatus ?? p?.booking_status ?? '';
  return String(status).toLowerCase() === 'cancelled';
}

/** Check if participant has explicit payment pending (exclude from joined spots) */
function hasPaymentPending(p: any): boolean {
  const ps = String(p?.paymentStatus ?? p?.payment_status ?? '').toLowerCase();
  return ps === 'pending' || ps.includes('pending');
}

/**
 * Calculates the total number of spots filled for an event, including guests (+1).
 * Sums (1 + guestCount) for each joined participant. Excludes cancelled and payment-pending.
 * Fallbacks to eventTotalAttendNumber or spotsBooked if participants list is missing.
 */
export const calculateSpotsFilled = (
  event: Partial<EventData>,
  currentUserId?: number,
  guestsCountState?: number
): number => {
  const participants = event.participants || [];
  const aggregateCount = event.eventTotalAttendNumber ?? event.spotsInfo?.spotsBooked ?? 0;

  if (participants.length > 0) {
    const participantsListCount = participants.reduce((sum, p) => {
      if (isCancelled(p)) return sum;
      if (hasPaymentPending(p)) return sum;

      const gCount = getParticipantGuestCount(p);
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
