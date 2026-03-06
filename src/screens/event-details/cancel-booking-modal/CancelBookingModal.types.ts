export type CancelBookingModalVariant = 'noRefund' | 'cancelSession';

export interface CancelBookingModalProps {
  visible: boolean;
  onClose: () => void;
  /** 'noRefund' = player cancelling after deadline (no refund). 'cancelSession' = organiser/player cancelling with refund. */
  variant?: CancelBookingModalVariant;
  /** Booking ID (or event/session ID) to cancel when user taps "Cancel". */
  bookingId?: string | null;
  /** Called after cancel booking API succeeds. */
  onCancelSuccess?: () => void;
}
