import type { BaseEntity, EventData } from '@app-types';

export type EventType =
  | 'Tennis'
  | 'Badminton'
  | 'Basketball'
  | 'Padel'
  | 'Pilates'
  | 'Social'
  | 'Cricket';

export type EventCategory = 'Sports' | 'Social' | 'Tournament' | 'Class';

export interface Participant extends BaseEntity {
  name: string;
  avatar?: string;
}

export interface Organiser {
  userId?: number;
  id?: string;
  fullName?: string;
  name?: string;
  profilePic?: string | null;
  avatar?: string;
  isVerified: boolean;
  eventsHosted?: number;
  communityName?: string; // Optional: community name for navigation
  createdAt?: string;
  updatedAt?: string;
}

export interface EventLocation {
  name: string;
  address: string;
  city: string;
}

export interface Event extends BaseEntity {
  title: string;
  description?: string;
  organiser: Organiser;
  type: EventType;
  categories: EventCategory[];
  date: string;
  startTime: string;
  endTime: string;
  location: EventLocation;
  spotsAvailable?: number;
  totalSpots?: number;
  price: number;
  currency: string;
  image: string;
  status: 'open' | 'waiting' | 'closed' | 'full';
  participants: Participant[];
  isFeatured?: boolean;
  isPrivate?: boolean;
  approvalRequired?: boolean;
  userJoinStatus?: {
    hasJoined: boolean;
    inWaitlist: boolean;
    canRequest: boolean;
    action: string;
  };
}

// API Response Types
export interface ApiEventCreator {
  userId: number;
  mongoId: string;
  userType: string;
  email: string;
  mobileNumber: string;
  profilePic: string | null;
  fullName: string;
  yourBest: string;
  communityName: string;
  yourCity: string;
  sport1: string;
  sport2: string;
  sports: string[];
  bio: string;
  instagramLink: string;
  profileVisibility: string;
  followersCount: number;
  eventsCreated: number;
  totalAttendees: number;
  followingCount: number;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
}

export interface ApiEventParticipant {
  userId: number;
  userType: 'player' | 'organiser';
  email: string;
  mobileNumber: string;
  profilePic: string | null;
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  sport1: string;
  sport2?: string;
  joinedAt: string;
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

export interface SpotsInfo {
  totalSpots: number;
  spotsBooked: number;
  spotsLeft: number;
  spotsFull: boolean;
}

export interface ApiEventPayment {
  status: 'none' | 'pending' | 'paid' | string;
  bookingStatus: string | null;
  paymentStatus: string | null;
  bookingId: string | null;
  paymentId: string | null;
  stripePaymentIntentId: string | null;
}

export interface UserJoinStatus {
  hasJoined?: boolean;
  inWaitlist?: boolean;
  hasRequest?: boolean;
  requestStatus?: string | null;
  canRequest?: boolean;
  action: string;
  requiresAuth?: boolean;
}

export interface ApiEvent {
  eventId: string;
  mongoId: string;
  eventName: string;
  eventImages: string[];
  eventVideo: string | null;
  gameImages?: string[];
  gameVideo?: string | null;
  eventType: string;
  eventSports: string[];
  eventDateTime: string;
  eventFrequency: string[];
  eventLocation: string;
  eventDescription: string;
  eventGender: string | null;
  eventSportsLevel: string | null;
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
  eventStatus: string;
  eventCreatorEmail: string;
  eventCreatorName: string;
  eventCreatorProfilePic: string | null;
  eventTotalAttendNumber: number;
  createdAt: string;
  updatedAt: string;
  timeUntilStart: TimeUntilStart;
  /** Event requires organiser approval to join (may be true when IsPrivateEvent is false). */
  approvalRequired?: boolean;
  /** e.g. "required" */
  approvalStatus?: string;
  creator: ApiEventDetailsCreator;
  participants: ApiEventParticipant[];
  participantsCount: number;
  waitlist: ApiEventParticipant[];
  waitlistCount: number;
  userJoinStatus: UserJoinStatus;
  /** Mirror of userJoinStatus from event-details API. */
  userStatus?: UserJoinStatus;
  spotsInfo: SpotsInfo;
  availableSpots: number;
  isFull: boolean;
  isJoined?: boolean;
  isPending?: boolean;
  isLeave?: boolean;
  /** From event-details API when user has joined. */
  booking?: {
    bookingId: string | null;
    status: string;
    joinedAt: string;
  };
  payment?: ApiEventPayment;
}

export interface ApiEventsResponse {
  success: boolean;
  message: string;
  data: {
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

export interface ApiEventDetailsCreator {
  userId: number;
  fullName: string;
  email: string;
  profilePic: string | null;
  communityName: string;
  eventsCreated: number;
  totalAttendees: number;
}

export interface ApiEventDetailsResponse {
  success: boolean;
  message: string;
  data: {
    event: ApiEvent;
  };
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  isActive: boolean;
  icon?: string; // Optional icon for the filter option (e.g., sport icons)
}

export interface DateFilter {
  date: number;
  day: string;
  month: string;
  isSelected: boolean;
  fullDate?: string; // ISO string for accurate date tracking across months
}

export interface City extends BaseEntity {
  name: string;
  country: string;
}
