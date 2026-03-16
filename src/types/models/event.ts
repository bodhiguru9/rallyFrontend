import type { BaseEntity } from '../index';

export interface EventCreator {
  userId: number;
  fullName: string;
  email: string;
  profilePic: string | null;
  communityName: string;
  eventsCreated: number;
  totalAttendees: number;
}

export interface EventParticipant {
  userId: number;
  userType: 'player' | 'organiser';
  email: string;
  mobileNumber: string;
  profilePic: string | null;
  fullName: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  sport1?: string;
  sport2?: string;
  joinedAt?: string;
  /** Join request id (for private events); used when removing participant via reject API */
  joinRequestId?: string;
  /** Number of additional guests (+1, +2, etc.). When backend sends this, display "Name +1" */
  guestCount?: number;
  /** Per-participant booking status. When 'cancelled', exclude from joined list */
  bookingStatus?: 'upcoming' | 'ongoing' | 'past' | 'cancelled' | string;
  /** Per-player booking slot start (ISO string). When backend sends this, show "Booked: D MMM, h:mm - h:mm A" */
  slotStartTime?: string;
  /** Per-player booking slot end (ISO string). Used with slotStartTime for range display */
  slotEndTime?: string;
  /** Amount paid by this participant. When backend sends this, show price (e.g. "₹ 120") */
  amountPaid?: number;
  /** Per-participant payment status. When 'pending', show "Pending Payment" tag (approval-required events) */
  paymentStatus?: 'pending' | 'paid' | 'unpaid' | string | null;
}

export interface TimeUntilStart {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  timeRemaining: string;
  timeRemainingShort: string;
  startsAt: string;
  startsAtFormatted: string;
}

export interface EventSpotsInfo {
  totalSpots: number;
  spotsBooked: number;
  spotsLeft: number;
  spotsFull: boolean;
}

/** Known values from API: 'payment-pending' | 'joined' | 'view' | 'request-pending' | 'request-join' etc. */
export type EventUserJoinAction =
  | 'payment-pending'
  | 'joined'
  | 'view'
  | 'request-pending'
  | 'request-join'
  | string;

export interface EventUserJoinStatus {
  hasJoined?: boolean;
  inWaitlist?: boolean;
  hasRequest?: boolean;
  requestStatus?: string;
  canRequest?: boolean;
  action: EventUserJoinAction;
  requiresAuth?: boolean;
}

export interface EventPayment {
  status: 'none' | 'pending' | 'paid' | string;
  bookingStatus: string | null;
  paymentStatus: string | null;
  bookingId: string | null;
  paymentId: string | null;
  stripePaymentIntentId: string | null;
}

export type EventType = 'social' | 'competitive' | 'training' | 'tournament';
export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'cancelled';
export type EventGender = 'male' | 'female' | 'mixed' | null;
export type EventSportsLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional' | null;

export interface EventData extends BaseEntity {
  eventLongitude: number | undefined;
  eventLatitude: number | undefined;
  eventId: string;
  mongoId: string;
  eventName: string;
  eventImages: string[];
  eventVideo: string | null;
  gameImages?: string[];
  gameVideo?: string | null;
  eventType: EventType;
  eventSports: string[];
  eventDateTime: string;
  eventEndDateTime?: string | null;
  eventFrequency: string[];
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
  eventCreatorEmail: string;
  eventCreatorName: string;
  eventCreatorProfilePic: string | null;
  eventTotalAttendNumber: number;
  createdAt: string;
  updatedAt: string;
  timeUntilStart?: TimeUntilStart;
  /** Event requires organiser approval to join. */
  approvalRequired?: boolean;
  /** e.g. "required" */
  approvalStatus?: string;
  creator: EventCreator | null;
  participants: EventParticipant[];
  participantsCount: number;
  waitlist: EventParticipant[];
  waitlistCount: number;
  spotsInfo: EventSpotsInfo;
  counts: Record<string, unknown> | null;
  userJoinStatus: EventUserJoinStatus | null;
  /** Mirror of userJoinStatus from event-details API. */
  userStatus?: EventUserJoinStatus | null;
  availableSpots: number;
  isFull: boolean;
  isJoined?: boolean;
  isPending?: boolean;
  isLeave?: boolean;
  isRejected?: boolean;
  /** From event-details / player-bookings API when user has joined. */
  booking?: {
    bookingId: string | null;
    joinedAt: string;
    bookingStatus: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
    bookingStatusValue: string | null;
    isPast: boolean;
    isOngoing: boolean;
    isUpcoming: boolean;
  };
  payment?: EventPayment;
}

export interface EventFilters {
  city?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  eventType?: EventType;
  eventStatus?: EventStatus;
  sport?: string;
}
