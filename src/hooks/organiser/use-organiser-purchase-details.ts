import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserPurchaseDetailsOptions {
  enabled?: boolean;
  page?: number;
  perPage?: number;
}

/**
 * Fetch organiser purchases detail for a user
 * GET /api/packages/organiser/purchases/:userId/details
 */
export const useOrganiserPurchaseDetails = (
  userId: number | string,
  options?: UseOrganiserPurchaseDetailsOptions,
) => {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;

  return useQuery({
    queryKey: ['organiser-purchase-details', userId, page, perPage],
    queryFn: () => organiserService.getOrganiserPurchaseDetails(userId, page, perPage),
    enabled: options?.enabled !== false && !!userId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

