import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UsePlayerPurchasedPackagesOptions {
  enabled?: boolean;
  /** GET /api/packages/my-packages?page= */
  page?: number;
}

/**
 * Purchased packages for the current user (auth).
 * GET /api/packages/my-packages
 */
export const usePlayerPurchasedPackages = (options?: UsePlayerPurchasedPackagesOptions) => {
  const page = options?.page ?? 1;

  return useQuery({
    queryKey: ['player-my-packages', page],
    queryFn: () => organiserService.getPlayerMyPackages(page),
    enabled: options?.enabled !== false,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });
};
