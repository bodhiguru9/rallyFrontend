import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services';

interface UseOrganiserBookingsAnalyticsOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch organiser bookings analytics
 */
export const useOrganiserBookingsAnalytics = (options?: UseOrganiserBookingsAnalyticsOptions) => {
  return useQuery({
    queryKey: ['organiserBookingsAnalytics'],
    queryFn: () => organiserService.getOrganiserBookingsAnalytics(),
    retry: 2,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: options?.enabled !== false,
  });
};
