import { useQuery } from '@tanstack/react-query';
import { userService } from '@services/user-service';
import type { TopOrganisersResponse } from '@app-types';

interface UseTopOrganisersOptions {
  page?: number;
  enabled?: boolean;
}

/**
 * Query hook to fetch top organisers
 * Returns a list of verified top organisers with pagination
 */
export const useTopOrganisers = ({ page = 1, enabled = true }: UseTopOrganisersOptions = {}) => {
  return useQuery<TopOrganisersResponse>({
    queryKey: ['top-organisers', page],
    queryFn: () => userService.getTopOrganisers(page),
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};

/**
 * Query hook to search organisers by query string
 * Returns a list of organisers matching the search query
 */
export const useSearchOrganisers = (query: string, page: number = 1) => {
  return useQuery<TopOrganisersResponse>({
    queryKey: ['search-organisers', query, page],
    queryFn: () => userService.searchOrganisers(query, page),
    enabled: query.trim().length > 0, // Only run query if query is not empty
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
};
