import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UsePlayerMyPackagePurchaseDetailOptions {
  enabled?: boolean;
}

/**
 * Single purchase for the current user (auth).
 * GET /api/packages/my-packages/:purchaseId
 */
export const usePlayerMyPackagePurchaseDetail = (
  purchaseId: string | undefined,
  options?: UsePlayerMyPackagePurchaseDetailOptions,
) => {
  return useQuery({
    queryKey: ['player-my-package-purchase', purchaseId],
    queryFn: () => organiserService.getPlayerMyPackagePurchaseDetail(String(purchaseId)),
    enabled: (options?.enabled !== false) && !!purchaseId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
