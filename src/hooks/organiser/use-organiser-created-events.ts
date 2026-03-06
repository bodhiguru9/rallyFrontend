import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services';

interface UseOrganiserCreatedEventsOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch organiser created events for the logged-in organiser.
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @param options.enabled - Enable/disable query execution (default: true)
 */
export const useOrganiserCreatedEvents = (
  page: number = 1,
  limit: number = 10,
  options?: UseOrganiserCreatedEventsOptions,
) => {
  return useQuery({
    queryKey: ['organiser-created-events', page, limit],
    queryFn: () => organiserService.getOrganiserCreatedEvents(page, limit),
    retry: 1,
    staleTime: 2 * 60 * 1000,
    enabled: options?.enabled !== false,
  });
};
