import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserPackageDetailsOptions {
  enabled?: boolean;
}

/**
 * Fetch organiser package details by packageId
 * GET /api/packages/:packageId/details
 */
export const useOrganiserPackageDetails = (
  packageId: string,
  options?: UseOrganiserPackageDetailsOptions,
) => {
  return useQuery({
    queryKey: ['organiser-package-details', packageId],
    queryFn: () => organiserService.getPackageDetails(packageId),
    enabled: options?.enabled !== undefined ? options.enabled : !!packageId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

