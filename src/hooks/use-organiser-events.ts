import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserEventsOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch organiser events by user ID
 * Returns paginated list of events for a specific organiser
 * @param userId - Organiser user ID
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 20)
 * @param options - Optional configuration
 * @param options.enabled - Enable/disable query execution (default: true if userId is valid)
 */
export const useOrganiserEvents = (
  userId: number,
  page: number = 1,
  perPage: number = 20,
  options?: UseOrganiserEventsOptions,
) => {
  return useQuery({
    queryKey: ['organiser-events', userId, page, perPage],
    queryFn: () => organiserService.getOrganiserEvents(userId, page, perPage),
    enabled: options?.enabled !== undefined ? options.enabled : !!userId && userId > 0, // Use provided enabled or default based on userId
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};
