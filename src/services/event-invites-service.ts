import { apiClient } from './api/api-client';

export interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MyEventInvitationsApiResponse {
  success: boolean;
  message: string;
  data: {
    role: 'player' | string;
    invitations: Array<{
      inviteId: string | null;
      event: {
        eventId: string;
        eventTitle?: string | null;
        eventName?: string | null;
        eventCategory?: string | null;
        eventType?: string | null;
        eventDateTime?: string | null;
        eventLocation?: string | null;
        eventImages?: string[];
        IsPrivateEvent?: boolean;
      };
      organiser: {
        userId: number;
        fullName: string;
        profilePic: string | null;
        communityName?: string | null;
      };
      message: string | null;
      status: 'pending' | 'accepted' | 'declined' | 'cancelled' | string;
      createdAt: string;
      acceptedAt: string | null;
      declinedAt: string | null;
      cancelledAt: string | null;
    }>;
    totalInvitations: number;
    pagination: PaginationData;
    filter: {
      status: string;
    };
  };
}

export type MyEventInvitationsData = MyEventInvitationsApiResponse['data'];

export interface OrganiserEventInvitationsApiResponse {
  success: boolean;
  message: string;
  data: {
    invitations: Array<{
      inviteId: string | null;
      event: {
        eventId: string;
      } | null;
      player: {
        userId: number;
        fullName: string;
        profilePic: string | null;
      } | null;
      message: string | null;
      status: 'pending' | 'accepted' | 'declined' | 'cancelled' | string;
      createdAt: string;
    }>;
    totalInvitations: number;
    filter?: { eventId?: string; status?: string };
  };
}

export const eventInvitesService = {
  /**
   * GET /api/event-invites/my?page=1&status=pending
   */
  getMyInvitations: async (page: number = 1, status: string = 'pending'): Promise<MyEventInvitationsData> => {
    const { data } = await apiClient.get<MyEventInvitationsApiResponse>('/api/event-invites/my', {
      params: { page, status },
    });

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch invitations');
    }

    return data.data;
  },

  /**
   * GET /api/event-invites/organiser?eventId=xyz&page=1
   */
  getOrganiserEventInvites: async (eventId: string, page: number = 1): Promise<OrganiserEventInvitationsApiResponse['data']> => {
    const { data } = await apiClient.get<OrganiserEventInvitationsApiResponse>('/api/event-invites/organiser', {
      params: { eventId, page },
    });

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch organiser invitations');
    }

    return data.data;
  },

  /**
   * POST /api/event-invites/:inviteId/accept
   */
  acceptInvitation: async (inviteId: string): Promise<void> => {
    await apiClient.post(`/api/event-invites/${inviteId}/accept`, {});
  },

  /**
   * POST /api/event-invites/:inviteId/decline
   */
  declineInvitation: async (inviteId: string): Promise<void> => {
    await apiClient.post(`/api/event-invites/${inviteId}/decline`, {});
  },
};

