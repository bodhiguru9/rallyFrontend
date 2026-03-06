import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@services/event-service';

export function usePendingRequestMutations(eventId: string) {
  const queryClient = useQueryClient();

  const acceptPendingRequestMutation = useMutation({
    mutationFn: ({ joinRequestId }: { joinRequestId: string }) =>
      eventService.acceptPendingRequest(eventId, joinRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-pending-requests', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });
  const removeParticipantMutation = useMutation({
  mutationFn: ({ userId }: { userId: string }) =>
    eventService.removeParticipant(eventId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['event', eventId] });
  },
});
  const declinePendingRequestMutation = useMutation({
    mutationFn: ({ joinRequestId }: { joinRequestId: string }) =>
      eventService.declinePendingRequest(eventId, joinRequestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-pending-requests', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
  });

  return { acceptPendingRequestMutation, declinePendingRequestMutation };
}
