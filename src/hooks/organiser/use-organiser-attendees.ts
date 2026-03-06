import { useQuery } from '@tanstack/react-query';
import { organiserService } from '@services/organiser-service';

interface UseOrganiserAttendeesOptions {
  enabled?: boolean;
}

export const useOrganiserAttendees = (
  page: number = 1,
  perPage: number = 20,
  options?: UseOrganiserAttendeesOptions,
) => {
  return useQuery({
    queryKey: ['organiser-attendees', page, perPage],
    queryFn: () => organiserService.getOrganiserAttendees(page, perPage),
    enabled: options?.enabled !== false,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
