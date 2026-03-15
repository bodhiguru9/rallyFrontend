import { apiClient } from './api/api-client';
import type {
  OrganiserDashboardData,
  SummaryCard,
  Transaction,
} from '@screens/organiser/data/organiserDashboard.data';
import type { EventData } from '@app-types';
import { formatDate } from '@utils';

/**
 * API Response type for organiser analytics
 */
export interface OrganiserAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    organizerId: number;
    stats: {
      totalEvents: number;
      upcomingEvents: number;
      ongoingEvents: number;
      pastEvents: number;
      totalRevenue: number;
      totalTransactions: number;
      averageRevenuePerEvent: number;
      revenuePeriod: string;
      totalMembers: string | number;
    };
    revenue: {
      total: number;
      period: string;
      bySport: Record<string, number>;
    };
    events: {
      upcoming: EventData[];
      ongoing: EventData[];
      past: EventData[];
      total: number;
    };
    transactions: Array<{
      id?: string;
      transactionId?: string;
      memberName?: string;
      memberAvatar?: string;
      bookedDate?: string;
      bookedTime?: string;
      amount?: number;
      currency?: string;
      eventId?: string;
      eventName?: string;
      createdAt?: string;
      eventDateTime?: string;
    }>;
    filters: {
      sport: string | null;
      startDate: string | null;
      endDate: string | null;
      revenuePeriod: string;
    };
  };
}

export interface OrganiserBookingsAnalyticsEvent {
  eventId: string;
  title: string;
  sports: string[];
  dateTime: string;
  address: string;
  price: number;
  eventImage: string;
  participants: Array<{
    userId: number;
    profilePic: string | null;
    fullName: string;
  }>;
  participantsCount: number;
  bookedCount: number;
  bookedRevenue: number;
  eventType?: string;
}

export interface OrganiserBookingsAnalytics {
  totalRevenue: number;
  totalBookings: number;
  events: OrganiserBookingsAnalyticsEvent[];
}

export interface OrganiserBookingsAnalyticsResponse {
  success: boolean;
  message: string;
  data?: {
    bookings?: OrganiserBookingsAnalytics;
    stats?: OrganiserAnalyticsResponse['data']['stats'];
    revenue?: OrganiserAnalyticsResponse['data']['revenue'];
    events?: OrganiserAnalyticsResponse['data']['events'] | EventData[];
  };
  bookings?: OrganiserBookingsAnalytics;
}

export interface OrganiserBookingsAnalyticsFilters {
  revenuePeriod?: 'today' | 'lastWeek' | 'thisMonth' | '6months' | 'lifetime';
  sport?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrganiserTransactionsResponse {
  success: boolean;
  message: string;
  data?: {
    transactions?: OrganiserAnalyticsResponse['data']['transactions'];
  };
  transactions?: OrganiserAnalyticsResponse['data']['transactions'];
}

/** Bank account (organiser payout) */
export interface OrganiserBankAccount {
  id: string;
  bankAccountId: string;
  accountHolderName: string;
  iban: string;
  bankName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccountRequest {
  accountHolderName: string;
  iban: string;
  bankName: string;
}

export interface UpdateBankAccountRequest {
  accountHolderName?: string;
  iban?: string;
  bankName?: string;
}

export interface OrganiserBankAccountCreateResponse {
  success: boolean;
  message: string;
  data?: { bankAccount: OrganiserBankAccount };
}

export interface OrganiserBankAccountsListResponse {
  success: boolean;
  message: string;
  data?: { bankAccounts: OrganiserBankAccount[]; total: number };
}

export interface OrganiserBankAccountGetResponse {
  success: boolean;
  message: string;
  data?: { bankAccount: OrganiserBankAccount };
}

export interface OrganiserBankAccountUpdateResponse {
  success: boolean;
  message: string;
  data?: { bankAccount: OrganiserBankAccount };
}

export interface OrganiserBankAccountDeleteResponse {
  success: boolean;
  message: string;
  data?: { id: string; deletedAt: string };
}

/**
 * API Response type for organiser events
 */
export interface OrganiserEventsResponse {
  success: boolean;
  message: string;
  data: {
    organiser: {
      userId: number;
      fullName: string;
      communityName: string;
    };
    events: EventData[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface OrganiserCreatedEventsResponse {
  success: boolean;
  message: string;
  data: {
    events: EventData[];
    pagination: {
      total?: number;
      totalCount?: number;
      totalPages?: number;
      currentPage?: number;
      perPage?: number;
      limit?: number;
      skip?: number;
      hasNextPage?: boolean;
      hasPrevPage?: boolean;
      hasMore?: boolean;
      hasPrevious?: boolean;
    };
    organiser?: {
      userId: number;
      fullName: string;
      email?: string;
      profilePic?: string | null;
      eventsCreated?: number;
      totalAttendees?: number;
    };
  } | null;
}

export interface OrganiserMembersResponse {
  success: boolean;
  message: string;
  data: {
    organiser?: {
      userId: number;
      fullName: string;
      communityName: string | null;
    };
    members: Array<{
      userId: number;
      userType?: string;
      email?: string;
      mobileNumber?: string;
      fullName: string;
      profilePic: string | null;
      totalBookedEvents?: number;
      totalBookingAmount?: number;
      lastBookedAt?: string;
      organiserBookedEvents?: number;
      organiserBookingAmount?: number;
      organiserLastBookedAt?: string;
    }>;
    totalMembers?: number;
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface OrganiserAttendeesResponse {
  success: boolean;
  message: string;
  data: {
    attendees: Array<{
      userId: number;
      fullName: string;
      profilePic: string | null;
      joinedEventsCount?: number;
      totalBookedEvents?: number;
      totalBookingAmount?: number;
      organiserBookedEvents?: number;
      organiserBookingAmount?: number;
      lastBookedAt?: string;
    }>;
    totalAttendees?: number;
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface CreatePackageRequest {
  packageName: string;
  sports: string[];
  eventType: string[]; // multi select
  validity: string;
  packageDescription: string;
  events: number;
  price: number;
}

export type UpdatePackageRequest = CreatePackageRequest;

export interface CreatePackageResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PackageDetailsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PurchasePackageResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OrganiserPackagePurchasesResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface OrganiserPackagePurchaseDetailsResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UserJoinedEventsResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      userId: number;
      userType: string;
      fullName: string;
      communityName: string | null;
    };
    events: Array<EventData & { joinedAt?: string }>;
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface AcceptedSubscriber {
  requestId: string;
  user: {
    userId: number;
    userType: string;
    email: string;
    mobileNumber: string;
    profilePic: string | null;
    fullName: string;
    dob: string;
    gender: string;
    sport1: string;
    sport2?: string;
    sports: string[];
  };
  status: string;
  acceptedAt: string;
  createdAt: string;
}

export interface AcceptedSubscribersResponse {
  success: boolean;
  data: {
    acceptedUsers: AcceptedSubscriber[];
    organiser: {
      userId: number;
      fullName: string;
    };
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

/**
 * Format number for display (e.g., 2300 -> "2.3K", 1000000 -> "1M")
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Map API transaction to Transaction type
 */
const mapTransaction = (
  apiTransaction: OrganiserAnalyticsResponse['data']['transactions'][0],
): Transaction => {
  const id = apiTransaction.id || apiTransaction.transactionId || '';
  const amount = apiTransaction.amount || 0;
  const currency = apiTransaction.currency || '₹';

  // Parse date and time from eventDateTime or createdAt
  let bookedDate = '';
  let bookedTime = '';

  if (apiTransaction.eventDateTime) {
    bookedDate = formatDate(apiTransaction.eventDateTime, 'date');
    bookedTime = formatDate(apiTransaction.eventDateTime, 'time');
  } else if (apiTransaction.createdAt) {
    bookedDate = formatDate(apiTransaction.createdAt, 'date');
    bookedTime = formatDate(apiTransaction.createdAt, 'time');
  } else if (apiTransaction.bookedDate && apiTransaction.bookedTime) {
    bookedDate = apiTransaction.bookedDate;
    bookedTime = apiTransaction.bookedTime;
  }

  return {
    id,
    memberName: apiTransaction.memberName || 'Unknown',
    memberAvatar: apiTransaction.memberAvatar,
    bookedDate,
    bookedTime,
    amount,
    currency,
  };
};

/**
 * Normalize package ID to backend format (e.g., "pkg-1" -> "PKG1")
 * Converts to uppercase and removes hyphens
 */
const normalizePackageId = (packageId: string): string => {
  return packageId.toUpperCase().replace(/-/g, '');
};

const mapAnyEventToBookingsAnalyticsEvent = (event: any): OrganiserBookingsAnalyticsEvent => {
  const participants = Array.isArray(event?.participants)
    ? event.participants.map((participant: any) => ({
      userId: Number(participant?.userId ?? 0),
      profilePic: participant?.profilePic ?? null,
      fullName: participant?.fullName ?? 'Participant',
    }))
    : [];

  const participantsCount = Number(
    event?.participantsCount ?? event?.eventMaxGuest ?? event?.spotsInfo?.totalSpots ?? 0,
  );

  const bookedCount = Number(
    event?.bookedCount ??
    event?.eventTotalAttendNumber ??
    event?.spotsInfo?.spotsBooked ??
    event?.participantsCount ??
    0,
  );

  return {
    eventId: String(event?.eventId ?? event?.id ?? ''),
    title: String(event?.title ?? event?.eventName ?? 'Untitled Event'),
    sports: Array.isArray(event?.sports)
      ? event.sports
      : Array.isArray(event?.eventSports)
        ? event.eventSports
        : [],
    dateTime: String(event?.dateTime ?? event?.eventDateTime ?? event?.createdAt ?? new Date().toISOString()),
    address: String(event?.address ?? event?.eventLocation ?? ''),
    price: Number(event?.price ?? event?.eventPricePerGuest ?? 0),
    eventImage: String(
      event?.eventImage ??
      (Array.isArray(event?.eventImages) ? event.eventImages[0] : '') ??
      '',
    ),
    participants,
    participantsCount,
    bookedCount,
    bookedRevenue: Number(event?.bookedRevenue ?? bookedCount * Number(event?.price ?? event?.eventPricePerGuest ?? 0)),
    eventType: event?.eventType,
  };
};

/**
 * Organiser service for dashboard and organiser-specific operations
 */
export const organiserService = {
  /**
   * Get organiser dashboard data from analytics API
   * Returns dashboard statistics, upcoming events, transactions, etc.
   */
  getOrganiserDashboard: async (): Promise<OrganiserDashboardData> => {
    try {
      const response = await apiClient.get<OrganiserAnalyticsResponse>('/api/organizers/analytics');

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Failed to load dashboard data');
      }

      const analyticsData = response.data.data as OrganiserAnalyticsResponse['data'] & {
        bookings?: OrganiserBookingsAnalytics;
      };
      const stats = analyticsData?.stats;
      const bookings = analyticsData?.bookings;
      const apiTransactions = analyticsData?.transactions || [];

      let totalRevenue = Number(
        stats?.totalRevenue ??
        analyticsData?.revenue?.total ??
        bookings?.totalRevenue ??
        0,
      );

      const totalEvents = Number(
        stats?.totalEvents ??
        bookings?.events?.length ??
        0,
      );

      // Source of truth for homepage revenue + member count:
      // /api/organizers/members -> totalBookingAmount
      let totalMembers = Number(stats?.totalMembers ?? 0);
      try {
        const firstPage = await apiClient.get<OrganiserMembersResponse>('/api/organizers/members', {
          params: { page: 1, perPage: 200 },
        });

        const firstData = firstPage.data?.data;
        const firstMembers = firstData?.members || [];

        const readMemberAmount = (member: any) =>
          Number(
            member?.totalBookingAmount ??
            member?.total_booking_amount ??
            member?.organiserBookingAmount ??
            member?.organiser_booking_amount ??
            0,
          );

        let membersRevenue = firstMembers.reduce((sum, member) => sum + readMemberAmount(member), 0);

        const totalPages = Number(firstData?.pagination?.totalPages ?? 1);

        if (totalPages > 1) {
          const pageRequests: Promise<any>[] = [];
          for (let page = 2; page <= totalPages; page++) {
            pageRequests.push(
              apiClient.get<OrganiserMembersResponse>('/api/organizers/members', {
                params: { page, perPage: 200 },
              }),
            );
          }

          const otherPages = await Promise.all(pageRequests);
          otherPages.forEach((pageResponse) => {
            const members = pageResponse.data?.data?.members || [];
            membersRevenue += members.reduce((sum: number, member: any) => sum + readMemberAmount(member), 0);
          });
        }

        totalRevenue = membersRevenue;

        totalMembers =
          Number(firstData?.pagination?.totalCount) ||
          Number(firstData?.totalMembers) ||
          Number(totalMembers) ||
          0;
      } catch {
        // If members API fails, keep analytics-derived totals.
      }

      // Map summary cards
      const summaryCards: SummaryCard[] = [
        {
          value: formatNumber(totalRevenue),
          label: 'Total Revenue',
        },
        {
          value: totalEvents.toString(),
          label: 'Events Hosted',
        },
        {
          value: String(totalMembers),
          label: 'Total Members',
        },
      ];

      // Map transactions
      const transactions: Transaction[] = (apiTransactions || []).map(mapTransaction);

      // Return mapped dashboard data
      return {
        summaryCards,
        calendarEvent: null, // Calendar events are handled separately via createdEvents
        mostBooked: [], // Not available in analytics API
        transactions,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load dashboard data. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 403) {
        userMessage = 'You do not have permission to access this dashboard.';
      } else if (statusCode === 404) {
        userMessage = 'Dashboard data not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser bookings analytics (total revenue + event bookings)
   */
  getOrganiserBookingsAnalytics: async (
    filters?: OrganiserBookingsAnalyticsFilters,
  ): Promise<OrganiserBookingsAnalytics> => {
    try {
      const response = await apiClient.get<OrganiserBookingsAnalyticsResponse>(
        '/api/organizers/analytics',
        {
          params: {
            revenuePeriod: filters?.revenuePeriod,
            sport: filters?.sport,
            startDate: filters?.startDate,
            endDate: filters?.endDate,
          },
        },
      );
      const bookings = response.data?.data?.bookings || response.data?.bookings;
      if (bookings) {
        return bookings;
      }

      const analyticsData = response.data?.data;
      if (!analyticsData) {
        throw new Error('Bookings analytics not available');
      }

      const eventsField = analyticsData.events;
      const rawEvents = Array.isArray(eventsField)
        ? eventsField
        : [
          ...(eventsField?.upcoming || []),
          ...(eventsField?.ongoing || []),
          ...(eventsField?.past || []),
        ];

      const mappedEvents = rawEvents.map(mapAnyEventToBookingsAnalyticsEvent);

      return {
        totalRevenue: Number(analyticsData.stats?.totalRevenue ?? analyticsData.revenue?.total ?? 0),
        totalBookings: Number(
          analyticsData.stats?.totalTransactions ??
          mappedEvents.reduce((sum, event) => sum + (event.bookedCount || 0), 0),
        ),
        events: mappedEvents,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load bookings analytics. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 403) {
        userMessage = 'You do not have permission to access analytics.';
      } else if (statusCode === 404) {
        userMessage = 'Analytics data not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser transactions list
   */
  getOrganiserTransactions: async (
    page: number = 1,
    perPage: number = 20,
    includeDummy: boolean = true,
  ): Promise<Transaction[]> => {
    try {
      const { data } = await apiClient.get<OrganiserTransactionsResponse>(
        '/api/organizers/transactions',
        {
          params: { page, perPage, includeDummy },
        },
      );

      const apiTransactions = data.data?.transactions || data.transactions || [];

      return (apiTransactions || []).map(mapTransaction);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load transactions. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Transactions not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser events by user ID
   * Returns paginated list of events for a specific organiser
   */
  getOrganiserEvents: async (
    userId: number,
    page: number = 1,
    perPage: number = 20,
  ): Promise<OrganiserEventsResponse> => {
    try {
      const { data } = await apiClient.get<OrganiserEventsResponse>(
        `/api/users/organiser/${userId}/events`,
        {
          params: { page, perPage },
        },
      );

      // Transform events to ensure they have all required fields; hide private events from players
      if (data.success && data.data.events) {
        const transformed = data.data.events
          .filter((event) => event.IsPrivateEvent !== true)
          .map((event: any) => {
            // Calculate spotsInfo if not present
            const spotsBooked = event.participantsCount || 0;
            const totalSpots = event.eventMaxGuest || 0;
            const spotsLeft = Math.max(0, totalSpots - spotsBooked);
            const spotsFull = spotsLeft === 0;

            // Normalize eventImages: eventImages, event_images, eventImage (singular), gameImages
            const rawImages = event.eventImages ?? event.event_images ?? [];
            let eventImages = Array.isArray(rawImages) ? rawImages : event.eventImage ? [event.eventImage] : [];
            if (eventImages.length === 0) {
              const gameImgs = event.gameImages ?? event.game_images ?? [];
              eventImages = Array.isArray(gameImgs) ? gameImgs : [];
            }
            if (eventImages.length === 0 && event.eventImage) {
              eventImages = [event.eventImage];
            }

            return {
              ...event,
              eventImages,
              // Ensure spotsInfo exists
              spotsInfo: event.spotsInfo || {
                totalSpots,
                spotsBooked,
                spotsLeft,
                spotsFull,
              },
              // Ensure availableSpots and isFull exist
              availableSpots: event.availableSpots ?? spotsLeft,
              isFull: event.isFull ?? spotsFull,
              // Ensure userJoinStatus exists
              userJoinStatus: event.userJoinStatus || {
                action: 'view',
                requiresAuth: false,
              },
              // Ensure waitlist arrays exist
              waitlist: event.waitlist || [],
              waitlistCount: event.waitlistCount || 0,
              // Ensure creator object exists
              creator: event.creator || null,
              // Ensure id field exists (required by BaseEntity)
              id: event.eventId,
            };
          });
        data.data.events = transformed;
      }

      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load organiser events. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Organiser not found or has no events.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser created events for the logged-in organiser
   * Returns paginated list of events created by the organiser
   */
  getOrganiserCreatedEvents: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<OrganiserCreatedEventsResponse> => {
    try {
      const { data } = await apiClient.get<OrganiserCreatedEventsResponse>(
        '/api/events/organiser/created-events',
        {
          params: { page, limit },
        },
      );

      if (data.success && data.data?.events) {
        data.data.events = data.data.events.map((event: any) => {
          const spotsBooked = event.participantsCount || 0;
          const totalSpots = event.eventMaxGuest || 0;
          const spotsLeft = Math.max(0, totalSpots - spotsBooked);
          const spotsFull = spotsLeft === 0;

          // Normalize eventImages: eventImages, event_images, eventImage (singular), gameImages
          const rawImages = event.eventImages ?? event.event_images ?? [];
          let eventImages = Array.isArray(rawImages) ? rawImages : event.eventImage ? [event.eventImage] : [];
          if (eventImages.length === 0) {
            const gameImgs = event.gameImages ?? event.game_images ?? [];
            eventImages = Array.isArray(gameImgs) ? gameImgs : [];
          }
          if (eventImages.length === 0 && event.eventImage) {
            eventImages = [event.eventImage];
          }

          return {
            ...event,
            eventImages,
            spotsInfo: event.spotsInfo || {
              totalSpots,
              spotsBooked,
              spotsLeft,
              spotsFull,
            },
            availableSpots: event.availableSpots ?? spotsLeft,
            isFull: event.isFull ?? spotsFull,
            userJoinStatus: event.userJoinStatus || {
              action: 'view',
              requiresAuth: false,
            },
            waitlist: event.waitlist || [],
            waitlistCount: event.waitlistCount || 0,
            creator: event.creator || null,
            id: event.id || event.eventId,
          };
        });
      }

      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load created events. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'No created events found for this organiser.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser members (most booked)
   */
  getOrganiserMembers: async (
    page: number = 1,
    perPage: number = 20,
    filters?: { period?: string; sport?: string },
  ): Promise<OrganiserMembersResponse> => {
    try {
      const params: Record<string, string | number> = { page, perPage };
      if (filters?.period && filters.period !== 'all-time') {
        params.period = filters.period;
      }
      if (filters?.sport) {
        params.sport = filters.sport;
      }
      const { data } = await apiClient.get<OrganiserMembersResponse>('/api/organizers/members', {
        params,
      });
      // Normalize member data: handle snake_case, use organiserBookingAmount for price
      if (data.success && data.data?.members) {
        data.data.members = data.data.members.map((m: any) => ({
          ...m,
          profilePic: m.profilePic ?? m.profile_pic ?? null,
          totalBookedEvents: m.totalBookedEvents ?? m.total_booked_events ?? m.organiserBookedEvents ?? m.organiser_booked_events ?? 0,
          totalBookingAmount: m.totalBookingAmount ?? m.total_booking_amount ?? m.organiserBookingAmount ?? m.organiser_booking_amount ?? 0,
        }));
      }
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load members. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Members not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Remove a member/follower from organiser list
   */
  removeOrganiserMember: async (userId: number | string): Promise<void> => {
    await apiClient.delete(`/api/organizers/members/${userId}`);
  },

  /**
   * Get organiser attendees
   */
  getOrganiserAttendees: async (
    page: number = 1,
    perPage: number = 20,
  ): Promise<OrganiserAttendeesResponse> => {
    try {
      const { data } = await apiClient.get<OrganiserAttendeesResponse>(
        '/api/organizers/attendees',
        {
          params: { page, perPage },
        },
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load attendees. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Attendees not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  createPackage: async (payload: CreatePackageRequest): Promise<CreatePackageResponse> => {
    try {
      const { data } = await apiClient.post<CreatePackageResponse>('/api/packages', payload);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to create package. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get user joined events by user ID
   */
  getUserJoinedEvents: async (
    userId: number,
    page: number = 1,
    perPage: number = 20,
  ): Promise<UserJoinedEventsResponse> => {
    try {
      const { data } = await apiClient.get<UserJoinedEventsResponse>(
        `/api/users/${userId}/joined-events`,
        {
          params: { page, perPage },
        },
      );
      if (data.success && data.data?.events) {
        data.data.events = data.data.events.map((event: any) => {
          const spotsBooked = event.participantsCount ?? event.eventTotalAttendNumber ?? 0;
          const totalSpots = event.eventMaxGuest ?? 0;
          const spotsLeft = Math.max(0, totalSpots - spotsBooked);
          const spotsFull = spotsLeft === 0;
          const rawImages = event.eventImages ?? event.event_images ?? [];
          const eventImages = Array.isArray(rawImages) ? rawImages : event.eventImage ? [event.eventImage] : event.gameImages ?? [];
          return {
            ...event,
            eventImages,
            spotsInfo: event.spotsInfo || { totalSpots, spotsBooked, spotsLeft, spotsFull },
            availableSpots: event.availableSpots ?? spotsLeft,
            isFull: event.isFull ?? spotsFull,
          };
        });
      }
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load joined events. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Joined events not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser packages by organiser ID
   * Returns paginated list of packages for a specific organiser
   */
  getOrganiserPackages: async (
    organiserId?: number,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      packages: Array<{
        packageId: string;
        packageName: string;
        packageDescription: string;
        sports: string[];
        eventType: string;
        packagePrice: number;
        validityMonths: number;
        maxEvents: number;
        eventIds: string[];
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        perPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
  }> => {
    try {
      const { data } = await apiClient.get('/api/packages/organiser/my-packages', {
        params: organiserId ? { organiserId } : undefined,
      });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load packages. Please try again.';

      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Organiser not found or has no packages.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get package details by packageId (organiser)
   * GET /api/packages/:packageId/details
   */
  getPackageDetails: async (packageId: string): Promise<PackageDetailsResponse> => {
    try {
      const normalizedId = normalizePackageId(packageId);
      const { data } = await apiClient.get<PackageDetailsResponse>(
        `/api/packages/${normalizedId}/details`,
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load package details. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Package not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Update package by packageId (organiser)
   * PUT /api/packages/:packageId
   */
  updatePackage: async (
    packageId: string,
    payload: UpdatePackageRequest,
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      const normalizedId = normalizePackageId(packageId);
      const { data } = await apiClient.put(`/api/packages/${normalizedId}`, payload);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to update package. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Package not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Delete package by packageId (organiser)
   * DELETE /api/packages/:packageId
   */
  deletePackage: async (packageId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const normalizedId = normalizePackageId(packageId);
      const { data } = await apiClient.delete(`/api/packages/${normalizedId}`);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to delete package. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Package not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Purchase a package (player)
   * POST /api/packages/:packageId/purchase
   */
  purchasePackage: async (packageId: string, payload?: any): Promise<PurchasePackageResponse> => {
    try {
      const normalizedId = normalizePackageId(packageId);
      const { data } = await apiClient.post<PurchasePackageResponse>(
        `/api/packages/${normalizedId}/purchase`,
        payload ?? {},
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to purchase package. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Package not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser package purchases (auth based)
   * GET /api/packages/organiser/purchases?page=1&perPage=20
   */
  getOrganiserPackagePurchases: async (
    page: number = 1,
    perPage: number = 20,
  ): Promise<OrganiserPackagePurchasesResponse> => {
    try {
      const { data } = await apiClient.get<OrganiserPackagePurchasesResponse>(
        '/api/packages/organiser/purchases',
        {
          params: { page, perPage },
        },
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load package purchases. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get organiser package purchase details for a user (auth based)
   * GET /api/packages/organiser/purchases/:userId/details?page=1&perPage=20
   */
  getOrganiserPurchaseDetails: async (
    userId: number | string,
    page: number = 1,
    perPage: number = 20,
  ): Promise<OrganiserPackagePurchaseDetailsResponse> => {
    try {
      const { data } = await apiClient.get<OrganiserPackagePurchaseDetailsResponse>(
        `/api/packages/organiser/purchases/${userId}/details`,
        { params: { page, perPage } },
      );
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load purchase details. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'Purchase details not found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  /**
   * Get accepted subscribers for an organiser
   * GET /api/request/accepted?organiserId={organiserId}&page={page}&perPage={perPage}
   */
  getAcceptedSubscribers: async (
    organiserId: number,
    page: number = 1,
    perPage: number = 10,
  ): Promise<AcceptedSubscribersResponse> => {
    try {
      const { data } = await apiClient.get<AcceptedSubscribersResponse>('/api/request/accepted', {
        params: { organiserId, page, perPage },
      });
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      const statusCode = error.response?.status;

      let userMessage = 'Failed to load subscribers. Please try again.';
      if (statusCode === 401) {
        userMessage = 'Session expired. Please log in again.';
      } else if (statusCode === 404) {
        userMessage = 'No subscribers found.';
      } else if (errorMessage) {
        userMessage = errorMessage;
      }

      const customError = new Error(userMessage) as any;
      customError.response = error.response;
      throw customError;
    }
  },

  // ─── Bank Accounts ─────────────────────────────────────────────────────────
  /**
   * Create a new bank account for the current organiser.
   * POST /api/organizers/bank-accounts
   */
  createBankAccount: async (
    payload: CreateBankAccountRequest,
  ): Promise<OrganiserBankAccount> => {
    const { data } = await apiClient.post<OrganiserBankAccountCreateResponse>(
      '/api/organizers/bank-accounts',
      payload,
    );
    if (!data.success || !data.data?.bankAccount) {
      throw new Error(data.message || 'Failed to create bank account');
    }
    return data.data.bankAccount;
  },

  /**
   * Get all bank accounts of the current organiser.
   * GET /api/organizers/bank-accounts
   */
  getBankAccounts: async (): Promise<{
    bankAccounts: OrganiserBankAccount[];
    total: number;
  }> => {
    const { data } = await apiClient.get<OrganiserBankAccountsListResponse>(
      '/api/organizers/bank-accounts',
    );
    if (!data.success || data.data === undefined) {
      throw new Error(data.message || 'Failed to load bank accounts');
    }
    return {
      bankAccounts: data.data.bankAccounts ?? [],
      total: data.data.total ?? 0,
    };
  },

  /**
   * Get one bank account by id (BA1 or MongoDB _id).
   * GET /api/organizers/bank-accounts/:id
   */
  getBankAccount: async (id: string): Promise<OrganiserBankAccount> => {
    const { data } = await apiClient.get<OrganiserBankAccountGetResponse>(
      `/api/organizers/bank-accounts/${encodeURIComponent(id)}`,
    );
    if (!data.success || !data.data?.bankAccount) {
      throw new Error(data.message || 'Bank account not found');
    }
    return data.data.bankAccount;
  },

  /**
   * Update a bank account by id. Only send fields to change.
   * PUT /api/organizers/bank-accounts/:id
   */
  updateBankAccount: async (
    id: string,
    payload: UpdateBankAccountRequest,
  ): Promise<OrganiserBankAccount> => {
    const { data } = await apiClient.put<OrganiserBankAccountUpdateResponse>(
      `/api/organizers/bank-accounts/${encodeURIComponent(id)}`,
      payload,
    );
    if (!data.success || !data.data?.bankAccount) {
      throw new Error(data.message || 'Failed to update bank account');
    }
    return data.data.bankAccount;
  },

  /**
   * Delete a bank account by id.
   * DELETE /api/organizers/bank-accounts/:id
   */
  deleteBankAccount: async (id: string): Promise<{ id: string; deletedAt: string }> => {
    const { data } = await apiClient.delete<OrganiserBankAccountDeleteResponse>(
      `/api/organizers/bank-accounts/${encodeURIComponent(id)}`,
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to delete bank account');
    }
    return { id: data.data.id, deletedAt: data.data.deletedAt };
  },
};
