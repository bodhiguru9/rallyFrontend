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

export const paymentService: {
  createBookingWithPayment: (eventId: string, promoCode?: string | null) => Promise<BookEventPaymentResponse>;
  verifyPayment: (paymentIntentId: string) => Promise<VerifyPaymentResponse>;
} = {
  /**
   * Create booking and get Stripe Payment Intent
   * @param eventId - The ID of the event to book
   * @param promoCode - Optional promo code
   * @returns BookEventPaymentResponse with Stripe payment intent
   */
  createBookingWithPayment: async (
    eventId: string,
    promoCode?: string | null,
  ): Promise<BookEventPaymentResponse> => {
    const url = promoCode
      ? `/api/bookings/book-event/${eventId}?promoCode=${promoCode}`
      : `/api/bookings/book-event/${eventId}`;

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
};
