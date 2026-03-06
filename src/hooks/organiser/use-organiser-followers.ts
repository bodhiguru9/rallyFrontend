import { useQuery } from '@tanstack/react-query';
import { userService } from '@services/user-service';

interface UseOrganiserFollowersOptions {
  enabled?: boolean;
}

export const useOrganiserFollowers = (
  organiserId: number,
  page: number = 1,
  perPage: number = 20,
  options?: UseOrganiserFollowersOptions,
) => {
  return useQuery({
    queryKey: ['organiser-followers', organiserId, page, perPage],
    queryFn: () => userService.getOrganiserFollowers(organiserId, page, perPage),
    enabled: options?.enabled !== undefined ? options.enabled : organiserId > 0,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};
