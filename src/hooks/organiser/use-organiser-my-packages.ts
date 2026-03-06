import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserMyPackagesOptions {
  enabled?: boolean;
}

/**
 * Fetch logged-in organiser packages (auth based)
 * GET /api/packages/organiser/my-packages
 */
export const useOrganiserMyPackages = (options?: UseOrganiserMyPackagesOptions) => {
  return useQuery({
    queryKey: ['organiser-my-packages'],
    queryFn: () => organiserService.getOrganiserPackages(),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

