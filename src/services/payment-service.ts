import { apiClient } from './api/api-client';

export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  amountInDollars: string;
  currency: string;
  status: string;
  description: string;
}

export interface BookingPaymentData {
  user: {
    userId: number;
    userType: string;
    email: string;
    fullName: string;
    mobileNumber: string;
    profilePic: string | null;
    stripeCustomerId?: string;
  };
  event: {
    eventId: string;
    eventTitle?: string;
    eventName: string;
    eventDateTime: string;
    eventLocation: string;
    eventImages: string[];
    gameJoinPrice: number;
  };
  booking: {
    bookingId: string;
    status: string;
    amount: number;
    discountAmount: number;
    finalAmount: number;
    promoCode: string | null;
    createdAt: string;
  };
  payment: {
    paymentId: string;
    status: string;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
    finalAmountInCents: number;
    currency: string;
    promoCode: string | null;
    stripePaymentIntentId: string;
  };
  paymentIntent: StripePaymentIntent;
  publishableKey: string;
  isFreeEvent: boolean;
  paymentRequired: boolean;
  paymentStatus: string;
}

export interface BookEventPaymentResponse {
  success: boolean;
  message: string;
  data: BookingPaymentData;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: {
      paymentId: string;
      status: string;
      amount: number;
      discountAmount: number;
      finalAmount: number;
      promoCode: string | null;
      stripePaymentIntentId: string;
      stripePaymentId: string;
      createdAt: string;
    };
    booking: {
      bookingId: string;
      eventId: string;
      eventTitle: string;
      status: string;
      bookedAt: string;
    };
  };
}

export interface SavedCard {
  cardId: string;
  brand: string | null;
  last4: string | null;
  expiry: string | null;
  expMonth: number | null;
  expYear: number | null;
  cardHolderName: string | null;
  isDefault: boolean;
  stripePaymentMethodId: string;
  createdAt: string;
}

export interface GetSavedCardsResponse {
  success: boolean;
  publishableKey?: string;
  debugUserId?: string | number;
  debugCardsCount?: number;
  data: {
    cards: SavedCard[];
  };
}

export const paymentService: {
  createBookingWithPayment: (eventId: string, promoCode?: string | null, guestsCount?: number, occurrenceStart?: string | null, occurrenceEnd?: string | null, timeZone?: string | null) => Promise<BookEventPaymentResponse>;
  verifyPayment: (paymentIntentId: string) => Promise<VerifyPaymentResponse>;
  getSavedCards: () => Promise<GetSavedCardsResponse>;
  saveCard: (cardData: { paymentMethodId: string; cardHolderName: string; isDefault: boolean }) => Promise<{ success: boolean; message: string }>;
} = {
  /**
   * Create booking and get Stripe Payment Intent
   * @param eventId - The ID of the event to book
   * @param promoCode - Optional promo code
   * @param guestsCount - Number of guests (user + additional). Backend uses this to enforce eventMaxGuest limit.
   * @returns BookEventPaymentResponse with Stripe payment intent
   */
  createBookingWithPayment: async (
    eventId: string,
    promoCode?: string | null,
    guestsCount: number = 1,
    occurrenceStart?: string | null,
    occurrenceEnd?: string | null,
    timeZone?: string | null,
  ): Promise<BookEventPaymentResponse> => {
    const params = new URLSearchParams();
    if (promoCode) params.set('promoCode', promoCode);
    if (guestsCount > 1) params.set('guestsCount', String(guestsCount));
    if (occurrenceStart) params.set('occurrenceStart', occurrenceStart);
    if (occurrenceEnd) params.set('occurrenceEnd', occurrenceEnd);
    if (timeZone) params.set('timeZone', timeZone);
    const query = params.toString();
    const url = query ? `/api/bookings/book-event/${eventId}?${query}` : `/api/bookings/book-event/${eventId}`;

    const { data } = await apiClient.post<BookEventPaymentResponse>(url);
    return data;
  },

  /**
   * Verify payment after Stripe confirmation
   * @param paymentIntentId - The Stripe payment intent ID
   * @returns VerifyPaymentResponse with payment and booking details
   */
  verifyPayment: async (paymentIntentId: string): Promise<VerifyPaymentResponse> => {
    const { data } = await apiClient.post<VerifyPaymentResponse>('/api/payments/verify', {
      payment_intent_id: paymentIntentId,
    });
    return data;
  },

  getSavedCards: async (): Promise<GetSavedCardsResponse> => {
    const { data } = await apiClient.get<GetSavedCardsResponse>('/api/cards');
    return data;
  },

  saveCard: async (cardData: {
    paymentMethodId: string;
    cardHolderName: string;
    isDefault: boolean;
  }): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>('/api/cards', {
      paymentMethodId: cardData.paymentMethodId,
      cardHolderName: cardData.cardHolderName,
      isDefault: cardData.isDefault,
    });
    return data;
  },
};
