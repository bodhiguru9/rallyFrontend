import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UsePackageDetailsOptions {
  enabled?: boolean;
}

/**
 * Fetch package details by packageId
 * GET /api/packages/:packageId/details
 */
export const usePackageDetails = (packageId?: string, options?: UsePackageDetailsOptions) => {
  return useQuery({
    queryKey: ['package-details', packageId],
    queryFn: () => organiserService.getPackageDetails(String(packageId)),
    enabled: options?.enabled !== undefined ? options.enabled : !!packageId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

