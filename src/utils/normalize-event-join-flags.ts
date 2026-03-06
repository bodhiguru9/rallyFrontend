import type { EventData } from '@app-types';

/** Event-like shape from API or app; allows extra fields (e.g. booking.status) and missing required fields. */
export type AnyEvent = Partial<EventData> & Record<string, unknown>;

const PAID_STATUSES = new Set(['paid', 'success', 'succeeded', 'completed', 'complete']);
const UNPAID_STATUSES = new Set([
  'unpaid',
  'pending',
  'failed',
  'requires_payment',
  'requires_payment_method',
]);

function extractPaymentStatus(e: AnyEvent): string | null {
  const booking = e.booking as Record<string, unknown> | undefined;
  const raw =
    e.paymentStatus ??
    e.payment_status ??
    e.payment?.status ??
    booking?.paymentStatus ??
    booking?.payment_status ??
    (booking?.payment as Record<string, unknown>)?.status ??
    null;

  if (raw === null || raw === undefined) return null;
  return String(raw).toLowerCase();
}

function extractIsPaid(e: AnyEvent): boolean | null {
  const v =
    e.isPaid ??
    e.is_paid ??
    e.paymentDone ??
    e.payment_done ??
    e.paymentCompleted ??
    e.payment_completed ??
    null;

  if (v === null || v === undefined) return null;
  return Boolean(v);
}

function paymentRequired(e: AnyEvent): boolean {
  // Some endpoints may expose explicit paymentRequired/payment_required
  if (typeof e.paymentRequired === 'boolean') return e.paymentRequired;
  if (typeof e.payment_required === 'boolean') return e.payment_required;

  const price = Number(e.eventPricePerGuest ?? e.gameJoinPrice ?? 0);
  return price > 0;
}

function resolvePaidState(e: AnyEvent): boolean | null {
  if (!paymentRequired(e)) return true; // free events are effectively "paid"

  const explicit = extractIsPaid(e);
  if (explicit !== null) return explicit;

  const status = extractPaymentStatus(e);
  if (!status) return null;

  if (PAID_STATUSES.has(status)) return true;
  if (UNPAID_STATUSES.has(status)) return false;

  // best-effort for unknown values
  if (status.includes('paid') || status.includes('success')) return true;
  if (status.includes('unpaid') || status.includes('pending') || status.includes('fail'))
    return false;

  return null;
}

/**
 * Enforces consistent join flags when private events require payment.
 *
 * Rule:
 * - If private event is "joined" but payment is not done => isPending=true, isJoined=false
 * - If private event is "pending" and payment is done => isPending=false, isJoined=true
 *
 * We only override when we have a clear paid/unpaid signal to avoid misclassifying.
 */
export function normalizeEventJoinFlags<T extends AnyEvent>(event: T): T {
  const isPrivate = Boolean(event.IsPrivateEvent);
  if (!isPrivate) return event;

  const paid = resolvePaidState(event);
  if (paid === null) return event;

  // unpaid: never treat as joined
  if (paid === false) {
    if (event.isJoined === true) {
      return { ...event, isJoined: false, isPending: true };
    }
    return event;
  }

  // paid: treat pending as joined (after organiser accept)
  if (paid === true) {
    if (event.isPending === true && event.isJoined !== true) {
      return { ...event, isPending: false, isJoined: true };
    }
    return event;
  }

  return event;
}
