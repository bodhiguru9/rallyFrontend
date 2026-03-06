import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseUserJoinedEventsOptions {
  enabled?: boolean;
}

export const useUserJoinedEvents = (
  userId: number,
  page: number = 1,
  perPage: number = 20,
  options?: UseUserJoinedEventsOptions,
) => {
  return useQuery({
    queryKey: ['user-joined-events', userId, page, perPage],
    queryFn: () => organiserService.getUserJoinedEvents(userId, page, perPage),
    enabled: options?.enabled !== undefined ? options.enabled : userId > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
