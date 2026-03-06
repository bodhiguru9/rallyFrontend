import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services';

interface UseOrganiserDashboardOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch organiser dashboard data
 * Includes summary cards, calendar events, most booked members, and transactions
 * @param options.enabled - Enable/disable query execution (default: true)
 */
export const useOrganiserDashboard = (options?: UseOrganiserDashboardOptions) => {
  return useQuery({
    queryKey: ['organiserDashboard'],
    queryFn: () => organiserService.getOrganiserDashboard(),
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true, // Refetch when user comes back to app
    enabled: options?.enabled !== false, // Allow disabling query
  });
};
