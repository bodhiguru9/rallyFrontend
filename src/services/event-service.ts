import { apiClient } from './api/api-client';
import type {
  EventData,
  EventFilters,
  WaitlistResponse,
  WaitlistActionResponse,
  PendingRequestsResponse,
} from '@app-types';
import type {
  ApiEventsResponse,
  ApiEventDetailsResponse,
  ApiEvent,
} from '@screens/home/Home.types';
import type { FilterOptionsResponse, FilterOptionsData } from '@app-types/api/filter-options.types';
import type { TagSearchEventsApiResponse, TagSearchEventsParams } from '@app-types/api/event.types';
import { normalizeEventJoinFlags, type AnyEvent } from '@utils';

/** Events with IsPrivateEvent are hidden from all player-facing lists. */
function filterOutPrivateEventsForPlayer<T extends { IsPrivateEvent?: boolean }>(events: T[]): T[] {
  return events.filter((e) => e.IsPrivateEvent !== true);
}

export const eventService = {
  /**
   * Get all events for player dashboard.
   * Private events (IsPrivateEvent) are never shown to players.
   */
  getAllEventsForPlayer: async (): Promise<{ events: EventData[]; pagination: unknown }> => {
    const { data } = await apiClient.get<ApiEventsResponse>('/api/events/all');

    if (!data.success || !data.data.events) {
      throw new Error(data.message || 'Failed to fetch events');
    }

    const normalized = (data.data.events || []).map(
      (e) => normalizeEventJoinFlags(e as AnyEvent) as EventData,
    );
    return {
      events: filterOutPrivateEventsForPlayer(normalized),
      pagination: data.data.pagination,
    };
  },

  /**
   * Get all events with optional filters
   */
  getEvents: async (filters?: EventFilters): Promise<Event[]> => {
    const { data } = await apiClient.get<Event[]>('/api/events', {
      params: filters,
    });
    return data;
  },

  /**
   * Search events by query string.
   * Private events (IsPrivateEvent) are never shown to players.
   */
  searchEvents: async (query: string): Promise<{ events: EventData[]; pagination: unknown }> => {
    const { data } = await apiClient.get<ApiEventsResponse>('/api/events/all', {
      params: { search: query },
    });

    if (!data.success || !data.data.events) {
      throw new Error(data.message || 'Failed to search events');
    }

    const normalized = (data.data.events || []).map(
      (e) => normalizeEventJoinFlags(e as AnyEvent) as EventData,
    );
    return {
      events: filterOutPrivateEventsForPlayer(normalized),
      pagination: data.data.pagination,
    };
  },

  /**
   * Search events by type or sport (GET /api/events/search/type-sport).
   * Private events (IsPrivateEvent) are never shown to players.
   * Request: eventType and/or eventSports query params
   */
  searchEventsByTypeSport: async (
    params: TagSearchEventsParams,
  ): Promise<{
    events: EventData[];
    pagination: TagSearchEventsApiResponse['data']['pagination'];
  }> => {
    const { data } = await apiClient.get<TagSearchEventsApiResponse>(
      '/api/events/search/type-sport',
      {
        params: { eventType: params.eventType, eventSports: params.eventSports },
      },
    );

    if (!data.success || !data.data.events) {
      throw new Error(data.message || 'Failed to search events by type/sport');
    }

    const events = (data.data.events || []).map((e) => {
      const normalized = normalizeEventJoinFlags(e as AnyEvent) as EventData;
      const ev = e as { eventId?: string; id?: string };
      return { ...normalized, id: ev.eventId ?? ev.id ?? normalized.id };
    });

    return {
      events: filterOutPrivateEventsForPlayer(events as EventData[]),
      pagination: data.data.pagination,
    };
  },

  /**
   * Get a single event by ID (old format)
   */
  getEventById: async (id: string): Promise<EventData> => {
    const { data } = await apiClient.get<ApiEventDetailsResponse>(`/api/events/${id}`);

    if (!data.success || !data.data.event) {
      throw new Error('Failed to fetch event details');
    }

    const apiEvent = data.data.event;

    // Transform ApiEvent to EventData by adding missing fields (API booking shape may differ)
    return normalizeEventJoinFlags({
      ...apiEvent,
      id: apiEvent.eventId, // Map eventId to id for BaseEntity
      counts: null,
      gameImages: apiEvent.gameImages || [],
      gameVideo: apiEvent.gameVideo || null,
      eventType: apiEvent.eventType as EventData['eventType'],
      eventGender: apiEvent.eventGender as EventData['eventGender'],
      eventSportsLevel: apiEvent.eventSportsLevel as EventData['eventSportsLevel'],
      eventStatus: apiEvent.eventStatus as EventData['eventStatus'],
    } as AnyEvent) as EventData;
  },

  /**
   * Get event details by ID for event details page
   */
  getEventDetails: async (eventId: string): Promise<ApiEvent> => {
    const { data } = await apiClient.get<ApiEventDetailsResponse>(`/api/events/${eventId}`);

    if (!data.success || !data.data.event) {
      throw new Error('Failed to fetch event details');
    }

    return normalizeEventJoinFlags(data.data.event as any) as ApiEvent;
  },

  /**
   * Create a new event
   */
  createEvent: async (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    const { data } = await apiClient.post<Event>('/api/events', event);
    return data;
  },

  /**
   * Create a new event with organiser-specific payload format.
   * Sends as FormData (multipart/form-data) so event image can be included.
   */
  createOrganiserEvent: async (eventData: {
    eventName: string;
    eventSports: string;
    eventType: string;
    eventDateTime?: string;
    eventLocation: string;
    eventDescription: string;
    eventGender?: string;
    eventSportsLevel?: string;
    eventMinAge?: number;
    eventMaxAge?: number;
    eventLevelRestriction?: string;
    eventMaxGuest: number;
    eventPricePerGuest: number;
    IsPrivateEvent: boolean;
    eventOurGuestAllowed: boolean;
    eventApprovalReq: boolean;
    eventRegistrationStartTime?: string;
    eventRegistrationEndTime?: string;
    eventFrequency?: string[];
    eventDisallow?: boolean;
    eventApprovalRequired?: boolean;
    /** Registration policy option value (e.g. before-event, until-start, no-restrictions) */
    policyJoind?: string;
    imageUri?: string | null;
  }): Promise<Event> => {
    const formData = new FormData();

    formData.append('eventName', eventData.eventName);
    formData.append('eventSports', eventData.eventSports);
    formData.append('eventType', eventData.eventType);
    if (eventData.eventDateTime != null) {
      formData.append('eventDateTime', eventData.eventDateTime);
    }
    formData.append('eventLocation', eventData.eventLocation);
    formData.append('eventDescription', eventData.eventDescription);
    if (eventData.eventGender != null) {
      formData.append('eventGender', eventData.eventGender);
    }
    if (eventData.eventSportsLevel != null) {
      formData.append('eventSportsLevel', eventData.eventSportsLevel);
    }
    if (eventData.eventMinAge != null) {
      formData.append('eventMinAge', String(eventData.eventMinAge));
    }
    if (eventData.eventMaxAge != null) {
      formData.append('eventMaxAge', String(eventData.eventMaxAge));
    }
    if (eventData.eventLevelRestriction != null) {
      formData.append('eventLevelRestriction', eventData.eventLevelRestriction);
    }
    formData.append('eventMaxGuest', String(eventData.eventMaxGuest));
    formData.append('eventPricePerGuest', String(eventData.eventPricePerGuest));
    formData.append('IsPrivateEvent', String(eventData.IsPrivateEvent));
    formData.append('eventOurGuestAllowed', String(eventData.eventOurGuestAllowed));
    formData.append('eventApprovalReq', String(eventData.eventApprovalReq));
    if (eventData.eventRegistrationStartTime != null) {
      formData.append('eventRegistrationStartTime', eventData.eventRegistrationStartTime);
    }
    if (eventData.eventRegistrationEndTime != null) {
      formData.append('eventRegistrationEndTime', eventData.eventRegistrationEndTime);
    }
    if (eventData.eventFrequency != null && eventData.eventFrequency.length > 0) {
      formData.append('eventFrequency', JSON.stringify(eventData.eventFrequency));
    }
    if (eventData.eventDisallow != null) {
      formData.append('eventDisallow', String(eventData.eventDisallow));
    }
    if (eventData.eventApprovalRequired != null) {
      formData.append('eventApprovalRequired', String(eventData.eventApprovalRequired));
    }
    if (eventData.policyJoind != null && eventData.policyJoind !== '') {
      formData.append('policyJoind', eventData.policyJoind);
    }

    if (eventData.imageUri) {
      const filename = eventData.imageUri.split('/').pop() || 'event-image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('eventImage', {
        uri: eventData.imageUri,
        name: filename,
        type,
      } as any);
    }

    const { data } = await apiClient.post<Event>('/api/events', formData);
    return data;
  },

  /**
   * Update an existing event
   */
  updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
    const { data } = await apiClient.put<Event>(`/api/events/${id}`, event);
    return data;
  },

  /**
   * Delete an event
   */
  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/events/${id}`);
  },

  /**
   * Join waitlist for a private event
   */
  joinWaitlist: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      `/api/events/${eventId}/join-waitlist`,
    );
    return data;
  },

  /**
   * Send join request for a private event
   */
  sendPrivateEventJoinRequest: async (
    eventId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      `/api/private-events/${eventId}/join-request`,
      {},
    );
    return data;
  },

  /**
   * Add reminder for an event (when registration is not yet open)
   */
  addEventReminder: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      `/api/event-reminders/${eventId}/add`,
      {},
    );
    return data;
  },

  /**
   * Get filter options for events (sports, event types, locations, prices)
   */
  getFilterOptions: async (): Promise<FilterOptionsData> => {
    const { data } = await apiClient.get<FilterOptionsResponse>('/api/events/filter-options');

    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to fetch filter options');
    }

    return data.data;
  },

  /**
   * Leave/cancel an event that the user has joined
   */
  leaveEvent: async (eventId: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete<{ success: boolean; message: string }>(
      `/api/events/${eventId}/join`,
    );
    return data;
  },

  /**
   * Send event invite to a player
   */
  sendEventInvite: async (
    eventId: string,
    playerId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      `/api/event-invites/${eventId}/send/${playerId}`,
      {},
    );
    return data;
  },

  /**
   * Notify all attendees of an event (Send Buzz)
   */
  notifyAttendees: async (
    eventId: string,
    message: string,
  ): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(
      `/api/events/${eventId}/notify-attendees`,
      { message },
    );
    return data;
  },

  /**
   * Get waitlist for an event
   */
  getEventWaitlist: async (eventId: string): Promise<WaitlistResponse> => {
    const { data } = await apiClient.get<WaitlistResponse>(`/api/events/${eventId}/waitlist`);
    return data;
  },

  /**
   * Get pending join requests for a private event
   */
  getEventPendingRequests: async (
    eventId: string,
    page: number = 1,
  ): Promise<PendingRequestsResponse> => {
    const { data } = await apiClient.get<PendingRequestsResponse>(
      `/api/private-events/${eventId}/pending-requests`,
      { params: { page } },
    );
    return data;
  },

  /**
   * Accept a pending join request
   */
  acceptPendingRequest: async (
    eventId: string,
    joinRequestId: string,
  ): Promise<WaitlistActionResponse> => {
    const { data } = await apiClient.post<WaitlistActionResponse>(
      `/api/private-events/${eventId}/join-requests/${joinRequestId}/accept`,
      {},
    );
    return data;
  },
removeParticipant: async (eventId: string, userId: string): Promise<void> => {
  await apiClient.delete(`/api/events/${eventId}/participants/${userId}`);
},
  /**
   * Reject a pending join request
   */
  declinePendingRequest: async (
    eventId: string,
    joinRequestId: string,
  ): Promise<WaitlistActionResponse> => {
    const { data } = await apiClient.post<WaitlistActionResponse>(
      `/api/private-events/${eventId}/join-requests/${joinRequestId}/reject`,
      {},
    );
    return data;
  },

  /**
   * Accept a waitlisted player
   */
  acceptWaitlistedPlayer: async (
    eventId: string,
    waitlistId: string,
  ): Promise<WaitlistActionResponse> => {
    const { data } = await apiClient.post<WaitlistActionResponse>(
      `/api/events/${eventId}/waitlist/${waitlistId}/accept`,
      {},
    );
    return data;
  },

  /**
   * Reject a waitlisted player
   */
  rejectWaitlistedPlayer: async (
    eventId: string,
    waitlistId: string,
  ): Promise<WaitlistActionResponse> => {
    const { data } = await apiClient.post<WaitlistActionResponse>(
      `/api/events/${eventId}/waitlist/${waitlistId}/reject`,
      {},
    );
    return data;
  },
};
