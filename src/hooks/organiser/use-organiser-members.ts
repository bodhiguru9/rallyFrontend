import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserMembersOptions {
  enabled?: boolean;
  period?: string;
  sport?: string;
}

export const useOrganiserMembers = (
  page: number = 1,
  perPage: number = 20,
  options?: UseOrganiserMembersOptions,
) => {
  const { period, sport } = options ?? {};
  return useQuery({
    queryKey: ['organiser-members', page, perPage, period, sport],
    queryFn: () =>
      organiserService.getOrganiserMembers(page, perPage, { period, sport }),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
