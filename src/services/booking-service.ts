import { apiClient } from './api/api-client';
import type {
  TimeUntilStart,
  EventType,
  EventStatus,
  EventGender,
  EventSportsLevel,
} from '@app-types/models/event';

export interface BookingUser {
  userId: number;
  userType: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  profilePic: string | null;
}

export interface BookingEvent {
  eventId: string;
  eventName: string;
  eventDateTime: string;
  eventLocation: string;
  eventImages: string[];
  gameJoinPrice: number;
}

export interface BookingDetails {
  bookingId: string;
  status: string;
  amount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode: string | null;
  bookedAt: string;
  createdAt: string;
}

export interface BookEventResponse {
  success: boolean;
  message: string;
  data: {
    user: BookingUser;
    event: BookingEvent;
    booking: BookingDetails;
    bookingConfirmationUrl: string | null;
    isFreeEvent: boolean;
    paymentRequired: boolean;
    paymentStatus: string;
  };
}

export interface BookEventErrorResponse {
  success: false;
  error: string;
}

// Player Bookings Types (matches GET /api/player/bookings response)
export interface PlayerBooking {
  eventId: string;
  mongoId: string;
  eventName: string;
  eventImages: string[];
  eventVideo: string | null;
  eventType: EventType;
  eventSports: string[];
  eventDateTime: string;
  eventEndDateTime?: string | null;
  eventFrequency: string[];
  eventFrequencyEndDate?: string | null;
  eventLocation: string;
  eventDescription: string;
  eventGender: EventGender;
  eventSportsLevel: EventSportsLevel;
  eventMinAge: number | null;
  eventMaxAge: number | null;
  eventLevelRestriction: string | null;
  eventMaxGuest: number;
  eventPricePerGuest: number;
  IsPrivateEvent: boolean;
  eventOurGuestAllowed: boolean;
  eventApprovalReq: boolean;
  eventRegistrationStartTime: string | null;
  eventRegistrationEndTime: string | null;
  eventStatus: EventStatus;
  eventTotalAttendNumber: number;
  createdAt: string;
  updatedAt: string;
  timeUntilStart?: TimeUntilStart;
  booking: {
    bookingId: string | null;
    joinedAt: string;
    bookingStatus: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
    bookingStatusValue: string | null;
    isPast: boolean;
    isOngoing: boolean;
    isUpcoming: boolean;
  };
  payment?: {
    paymentStatus: string;
  };
  creator?: {
    userId: number;
    fullName: string;
    email?: string;
    profilePic?: string | null;
  };
  isJoined?: boolean;
  isPending?: boolean;
  isLeave?: boolean;
}

export interface PlayerBookingsSummary {
  totalBookings: number;
  upcomingBookings: number;
  ongoingBookings: number;
  pastBookings: number;
  now: string;
}

export interface PlayerBookingsPagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PlayerBookingsResponse {
  success: boolean;
  message: string;
  data: {
    status: 'all' | 'upcoming' | 'past';
    summary: PlayerBookingsSummary;
    bookings: PlayerBooking[];
    pagination: PlayerBookingsPagination;
  };
}

export interface PlayerBookingsParams {
  status?: 'all' | 'upcoming' | 'past';
  page?: number;
}

export const bookingService = {
  /**
   * Book an event
   * @param eventId - The ID of the event to book
   * @returns BookEventResponse with booking details
   */
  bookEvent: async (eventId: string): Promise<BookEventResponse> => {
    const { data } = await apiClient.post<BookEventResponse>(
      `/api/bookings/book-event/${eventId}`,
    );
    return data;
  },

  /**
   * Get player bookings
   * @param params - Query parameters (status, page)
   * @returns PlayerBookingsResponse with booking list and pagination
   */
  getPlayerBookings: async (params?: PlayerBookingsParams): Promise<PlayerBookingsResponse> => {
    const { data } = await apiClient.get<PlayerBookingsResponse>('/api/player/bookings', {
      params: {
        status: params?.status || 'all',
        page: params?.page || 1,
      },
    });
    return data;
  },

  /**
   * Cancel a booking (POST /api/bookings/:bookingId/cancel).
   * Used when user cancels within no-refund window or organiser cancels a session/booking.
   */
  cancelBooking: async (bookingId: string): Promise<{ success: boolean; message?: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message?: string }>(
      `/api/bookings/${bookingId}/cancel`,
    );
    return data;
  },
};
