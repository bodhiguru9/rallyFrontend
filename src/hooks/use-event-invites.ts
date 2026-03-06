import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { eventInvitesService, type MyEventInvitationsData } from '@services/event-invites-service';

/**
 * Hook to fetch player event invitations
 */
export const useMyEventInvitations = (
  page: number = 1,
  status: string = 'pending',
  options?: Omit<UseQueryOptions<MyEventInvitationsData>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<MyEventInvitationsData>({
    queryKey: ['event-invites', 'my', page, status],
    queryFn: () => eventInvitesService.getMyInvitations(page, status),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useAcceptEventInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => eventInvitesService.acceptInvitation(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-invites'] });
    },
  });
};

export const useDeclineEventInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => eventInvitesService.declineInvitation(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-invites'] });
    },
  });
};

