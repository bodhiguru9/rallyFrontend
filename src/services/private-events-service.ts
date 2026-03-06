import { apiClient } from './api/api-client';
import type { WaitlistResponse } from '@app-types';

/**
 * Private Events APIs
 */
export const privateEventsService = {
  /**
   * Get pending requests for a private event
   * GET /api/private-events/:eventId/pending-requests?page=1
   *
   * Note: backend payload shape may differ from the existing waitlist endpoint,
   * so we keep the return type compatible with WaitlistResponse where possible.
   */
  getPendingRequests: async (eventId: string, page: number = 1): Promise<WaitlistResponse> => {
    const { data } = await apiClient.get<WaitlistResponse>(
      `/api/private-events/${eventId}/pending-requests`,
      {
        params: { page },
      },
    );
    return data;
  },

  /**
   * Remove a player from a private event
   * DELETE /api/private-events/:eventId/players/:playerId/remove
   */
 removePlayer: async (eventId: string, playerId: number | string): Promise<void> => {
  await apiClient.delete(`/api/events/${eventId}/participants/${playerId}`);
},
};
