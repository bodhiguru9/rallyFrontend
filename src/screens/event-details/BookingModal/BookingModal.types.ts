export interface IBookingModalProps {
  visible: boolean;
  totalPrice: number;
  currency: string;
  guestsCount: number;
  eventId?: string; // Optional - if not provided, modal only collects payment details
  onClose: () => void;
  onBookEvent: (payload?: BookingModalPaymentPayload) => void;
  onApplePay?: () => void;
  primaryButtonText?: string;
}

export interface BookingModalPaymentPayload {
  promoCode?: string | null;
  cardLast4?: string | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
  amount?: number;
  currency?: string;
  paymentIntentId?: string;
  bookingId?: string;
}
