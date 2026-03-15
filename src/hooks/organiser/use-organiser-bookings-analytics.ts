import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services';
import type { OrganiserBookingsAnalyticsFilters } from '@services';

interface UseOrganiserBookingsAnalyticsOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch organiser bookings analytics
 */
export const useOrganiserBookingsAnalytics = (
  filters?: OrganiserBookingsAnalyticsFilters,
  options?: UseOrganiserBookingsAnalyticsOptions,
) => {
  return useQuery({
    queryKey: ['organiserBookingsAnalytics', filters],
    queryFn: () => organiserService.getOrganiserBookingsAnalytics(filters),
    retry: 2,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: options?.enabled !== false,
  });
};
