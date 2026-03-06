import type { EventParticipant } from '@app-types';

export interface WaitlistUser extends EventParticipant {
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
}

export interface WaitlistEntry {
  waitlistId: string;
  mongoId: string;
  requestId: string;
  user: WaitlistUser;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  /**
   * Optional payment info (used by private event pending-requests endpoint)
   */
  paymentStatus?: 'paid' | 'unpaid' | 'pending' | string | null;
  isPaid?: boolean | null;
}

export interface WaitlistEventInfo {
  eventId: string;
  gameCreatorEmail: string;
  gameCreatorProfilePic: string | null;
  eventTitle: string;
  eventName: string;
  eventCategory: string;
  eventType: string;
}

export interface WaitlistCounts {
  totalSpots: number;
  joinedSpots: number;
  availableSpots: number;
  pendingWaitlist: number;
}

export interface WaitlistPagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data: {
    event: WaitlistEventInfo;
    waitlist: WaitlistEntry[];
    counts: WaitlistCounts;
    pagination: WaitlistPagination;
  };
}

export interface WaitlistActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
}
