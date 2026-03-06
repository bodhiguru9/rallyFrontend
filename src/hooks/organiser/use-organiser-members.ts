import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserMembersOptions {
  enabled?: boolean;
}

export const useOrganiserMembers = (
  page: number = 1,
  perPage: number = 20,
  options?: UseOrganiserMembersOptions,
) => {
  return useQuery({
    queryKey: ['organiser-members', page, perPage],
    queryFn: () => organiserService.getOrganiserMembers(page, perPage),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
