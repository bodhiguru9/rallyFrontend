import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserPackagePurchasesOptions {
  enabled?: boolean;
  page?: number;
  perPage?: number;
}

/**
 * Fetch organiser package purchases list
 * GET /api/packages/organiser/purchases
 */
export const useOrganiserPackagePurchases = (options?: UseOrganiserPackagePurchasesOptions) => {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;

  return useQuery({
    queryKey: ['organiser-package-purchases', page, perPage],
    queryFn: () => organiserService.getOrganiserPackagePurchases(page, perPage),
    enabled: options?.enabled !== false,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

