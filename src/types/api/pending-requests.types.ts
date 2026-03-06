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
