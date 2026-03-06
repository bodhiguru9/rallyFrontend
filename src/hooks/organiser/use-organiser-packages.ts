import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserPackagesOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch organiser packages by organiser ID
 * Returns paginated list of packages for a specific organiser
 * @param organiserId - Organiser user ID
 * @param options - Optional configuration
 * @param options.enabled - Enable/disable query execution (default: true if organiserId is valid)
 */
export const useOrganiserPackages = (
  organiserId: number,
  options?: UseOrganiserPackagesOptions,
) => {
  return useQuery({
    queryKey: ['organiser-packages', organiserId],
    queryFn: () => organiserService.getOrganiserPackages(organiserId),
    enabled: options?.enabled !== undefined ? options.enabled : !!organiserId && organiserId > 0,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};
