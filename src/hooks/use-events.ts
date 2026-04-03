import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@services/event-service';
import { organiserService } from '@services/organiser-service';
import { bookingService } from '@services/booking-service';
import { apiClient } from '@services/api/api-client';
import type { EventData, EventFilters, FilterOptionsData } from '@app-types';
import type { ApiEvent } from '@screens/home/Home.types';
import { normalizeEventJoinFlags, type AnyEvent } from '@utils';

/**
 * Query hook to fetch all events for player dashboard
 * Refreshes on mount and when window gains focus to ensure fresh data
 * Caching disabled to always show live API data
 */
export const usePlayerEvents = () => {
  return useQuery({
    queryKey: ['player-events'],
    queryFn: () => eventService.getAllEventsForPlayer(),
    staleTime: 0, // Always consider data stale to fetch fresh data
    gcTime: 0, // Don't cache data - remove immediately when unused
    refetchOnMount: 'always', // Always refetch when component mounts, even if data exists
    refetchOnWindowFocus: true, // Refetch when window/tab gains focus
    refetchOnReconnect: true, // Refetch when network reconnects
  });
};

/**
 * Query hook to fetch all events with optional filters
 */
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getEvents(filters),
  });
};

export interface UseEventOptions {
  /** When true, private events (IsPrivateEvent) are treated as not found for players. */
  forPlayer?: boolean;
  /** When true, bypasses the private event check even if forPlayer is true. Used when a player has an invitation. */
  allowPrivate?: boolean;
  /** From useQuery options */
  enabled?: boolean;
  /** For recurring events, specify which occurrence date to fetch participants for. */
  occurrenceStart?: string;
}

/**
 * Query hook to fetch a single event by ID (old format)
 * Updated to handle new response structure: { success, message, data: { event } }
 * When forPlayer is true, private events are not shown (throws so UI shows not found).
 */
export const useEvent = (id: string, options?: UseEventOptions) => {
  const { forPlayer = false, allowPrivate = false, enabled, occurrenceStart } = options ?? {};
  return useQuery({
    queryKey: ['event', id, forPlayer, allowPrivate, occurrenceStart],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: { event: ApiEvent };
      }>(`/api/events/${id}`); // REVERT: No occurrenceStart passed here anymore

      if (!response.data.success || !response.data.data.event) {
        throw new Error('Failed to fetch event details');
      }

      const apiEvent = response.data.data.event;

      // Transform ApiEvent to EventData by adding missing fields (API booking shape may differ)
      const apiEventAny = apiEvent as unknown as Record<string, unknown>;
      const normalized = normalizeEventJoinFlags({
        ...apiEvent,
        id: apiEvent.eventId, // Map eventId to id for BaseEntity
        counts: null,
        gameImages: apiEvent.gameImages || [],
        gameVideo: apiEvent.gameVideo || null,
        eventType: apiEvent.eventType as EventData['eventType'],
        eventGender: apiEvent.eventGender as EventData['eventGender'],
        eventSportsLevel: apiEvent.eventSportsLevel as EventData['eventSportsLevel'],
        eventStatus: apiEvent.eventStatus as EventData['eventStatus'],
        // Refund policy from organiser (API may return policyJoind, policy_joind, or refundPolicy)
        policyJoind:
          apiEventAny.policyJoind ??
          apiEventAny.policy_joind ??
          apiEventAny.refundPolicy ??
          null,
        // Map join status fields
        isJoined: apiEvent.isJoined ?? false,
        isPending: apiEvent.isPending ?? false,
        isLeave: apiEvent.isLeave ?? false,
      } as AnyEvent) as EventData;

      // DO NOT Re-fetch participants if they already exist (though they're usually empty on load)
      // If occurrenceStart is specified, always fetch from the dedicated endpoint for accuracy
      if (occurrenceStart) {
        try {
          const { data: participantsData } = await apiClient.get(`/api/events/${id}/participants`, {
            params: { occurrenceStart }
          });
          
          if (participantsData?.success) {
            normalized.participants = participantsData.data?.participants ?? participantsData.participants ?? [];
            
            // Also update spots info from the count in the participant result if available (or calculate)
            if (participantsData.data?.pagination) {
              const spotsBooked = participantsData.data.pagination.totalCount;
              
              if (normalized.spotsInfo) {
                normalized.spotsInfo.spotsBooked = spotsBooked;
                normalized.spotsInfo.spotsLeft = Math.max(0, (normalized.spotsInfo.totalSpots || normalized.eventMaxGuest || 0) - spotsBooked);
                normalized.spotsInfo.spotsFull = normalized.spotsInfo.spotsLeft <= 0;
              }
              
              // Map back to top-level fields for components that expect them
              // We override ALL related fields to ensure consistency throughout the app
              normalized.participantsCount = spotsBooked;
              normalized.eventTotalAttendNumber = spotsBooked; // Synchronize with total attend number
              normalized.availableSpots = Math.max(0, (normalized.eventMaxGuest || 0) - spotsBooked);
              normalized.isFull = normalized.availableSpots <= 0;
            }
          }
        } catch (error) {
          console.log('useEvent: Failed to fetch occurrence participants', error);
        }
      }

      // Do not show private events to players at all, unless explicitly allowed
      if (forPlayer && !allowPrivate && normalized.IsPrivateEvent === true) {
        throw new Error('Event not found');
      }

      return normalized;
    },
    enabled: (enabled !== undefined ? enabled : true) && !!id, // Only run query if id is provided and enabled
  });
};

/**
 * Query hook to fetch event details by ID
 */
export const useEventDetails = (eventId: string) => {
  return useQuery({
    queryKey: ['event-details', eventId],
    queryFn: () => eventService.getEventDetails(eventId),
    enabled: !!eventId, // Only run query if eventId is provided
  });
};

/**
 * Query hook to search events by type or sport (TagSearch screen)
 * GET /api/events/search/type-sport with eventType and/or eventSports
 */
export const useTagSearchEvents = (params: { eventType?: string; eventSports?: string }) => {
  const { eventType, eventSports } = params;
  const hasParams = !!(eventType?.trim() || eventSports?.trim());

  return useQuery({
    queryKey: ['tag-search-events', eventType, eventSports],
    queryFn: () => eventService.searchEventsByTypeSport({ eventType, eventSports }),
    enabled: hasParams,
  });
};

/**
 * Mutation hook to create a new event
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      // Invalidate and refetch events list
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Mutation hook to update an existing event
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event }: { id: string; event: Partial<EventData> }) =>
      eventService.updateEvent(id, event as any),
    onSuccess: (data: any) => {
      // Invalidate specific event and events list
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Mutation hook to delete an event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Mutation hook to join waitlist for a private event
 */
export const useJoinWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.joinWaitlist(eventId),
    onSuccess: (_data, eventId) => {
      // Invalidate event details to reflect updated waitlist status
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
    },
  });
};

/**
 * Mutation hook to send join request for a private event
 */
export const useSendPrivateEventJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.sendPrivateEventJoinRequest(eventId),
    onSuccess: (_data, eventId) => {
      // Invalidate event details to reflect updated join request status
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });
};

/**
 * Mutation hook to add reminder for an event
 */
export const useAddEventReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.addEventReminder(eventId),
    onSuccess: (_data, eventId) => {
      // Invalidate event details to reflect updated reminder status
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });
};

/**
 * Query hook to fetch event filter options globally
 * Returns sports, event types, locations, and prices for filtering
 * Data is cached for 5 minutes to reduce unnecessary API calls
 */
export const useFilterOptions = () => {
  return useQuery<FilterOptionsData>({
    queryKey: ['filter-options'],
    queryFn: () => eventService.getFilterOptions(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    refetchOnMount: false, // Don't refetch on component mount if data is fresh
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  });
};

/**
 * Mutation hook to book an event
 * Calls the booking API to book a free event or initiate payment for paid events
 */
export const useBookEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => bookingService.bookEvent(eventId),
    onSuccess: (_data, eventId) => {
      // Invalidate event details to reflect updated booking status
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
      queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
    },
  });
};

/**
 * Mutation hook to leave/cancel an event that the user has joined
 */
export const useLeaveEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventService.leaveEvent(eventId),
    onSuccess: (_data, eventId) => {
      // Invalidate event details to reflect updated leave status
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
    },
  });
};

/**
 * Query hook to search events by query string
 */
export const useSearchEvents = (query: string) => {
  return useQuery({
    queryKey: ['search-events', query],
    queryFn: () => eventService.searchEvents(query),
    enabled: query.trim().length > 0, // Only run query if query is not empty
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};

/**
 * Query hook to fetch events for a specific organiser by user ID
 */
export const useOrganiserEventsByUserId = (userId: number | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['organiser-events', userId],
    queryFn: async () => {
      if (!userId) {
        return { events: [], pagination: null };
      }
      const response = await organiserService.getOrganiserEvents(userId, 1, 20);
      return {
        events: response.data.events,
        pagination: response.data.pagination,
      };
    },
    enabled: enabled && !!userId,
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};
