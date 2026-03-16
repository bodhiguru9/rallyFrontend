export interface PendingRequestUser {
  userId: number;
  userType: string;
  email: string;
  profilePic: string | null;
  fullName: string;
}

export interface PendingRequest {
  joinRequestId: string;
  requestType: string;
  status: string;
  requestedAt: string;
  user: PendingRequestUser;
  /** Number of guests requested. API may send as guestCount or guest_count */
  guestCount?: number;
  guest_count?: number;
  /** When status is 'accepted', player awaits payment. Show "Pending Payment" tag */
  paymentStatus?: 'pending' | 'paid' | 'unpaid' | string | null;
  payment_status?: string | null;
}

export interface PendingRequestsPagination {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PendingRequestsResponse {
  success: boolean;
  message: string;
  data: {
    event: {
      eventId: string;
      eventName: string;
    };
    pendingRequests: PendingRequest[];
    pagination: PendingRequestsPagination;
    totalPendingRequests: number;
  };
}
