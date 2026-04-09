export interface IBookingModalProps {
  visible: boolean;
  totalPrice: number;
  currency: string;
  guestsCount: number;
  eventId?: string; // Optional - if not provided, modal only collects payment details
  occurrenceStart?: string | null; // ISO string - which occurrence is being booked
  occurrenceEnd?: string | null;   // ISO string - end of this occurrence
  onClose: () => void;
  onBookEvent: (payload?: BookingModalPaymentPayload) => void;
  primaryButtonText?: string;
}

export interface BookingModalPaymentPayload {
  promoCode?: string | null;
  amount?: number;
  currency?: string;
  paymentIntentId?: string;
  bookingId?: string;
  subtotal?: number;
  vatAmount?: number;
  discountAmount?: number;
}
