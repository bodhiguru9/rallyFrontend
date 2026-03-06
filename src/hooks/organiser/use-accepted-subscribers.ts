import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseAcceptedSubscribersOptions {
  enabled?: boolean;
}

export const useAcceptedSubscribers = (
  organiserId: number,
  page: number = 1,
  perPage: number = 10,
  options?: UseAcceptedSubscribersOptions,
) => {
  return useQuery({
    queryKey: ['accepted-subscribers', organiserId, page, perPage],
    queryFn: () => organiserService.getAcceptedSubscribers(organiserId, page, perPage),
    enabled: options?.enabled !== false && !!organiserId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
