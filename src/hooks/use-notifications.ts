import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { notificationService, type NotificationResponse } from '@services/notification-service';

/**
 * Hook to fetch organiser notifications
 * @param page - Page number (starts from 1)
 * @param options - Optional query options
 */
export const useOrganiserNotifications = (
  page: number = 1,
  options?: Omit<UseQueryOptions<NotificationResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<NotificationResponse>({
    queryKey: ['notifications', 'organiser', page],
    queryFn: () => notificationService.getOrganiserNotifications(page),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    ...options,
  });
};

/**
 * Hook to fetch player notifications
 * @param page - Page number (starts from 1)
 * @param options - Optional query options
 */
export const usePlayerNotifications = (
  page: number = 1,
  options?: Omit<UseQueryOptions<NotificationResponse>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<NotificationResponse>({
    queryKey: ['notifications', 'player', page],
    queryFn: () => notificationService.getPlayerNotifications(page),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    ...options,
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook to mark a player notification as read
 */
export const useMarkPlayerNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markPlayerNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate and refetch player notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', 'player'] });
    },
  });
};

/**
 * Hook to mark all notifications as read (generic)
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook to mark all player notifications as read
 */
export const useMarkAllPlayerNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllPlayerNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate and refetch player notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', 'player'] });
    },
  });
};

/**
 * Hook to mark all organiser notifications as read
 */
export const useMarkAllOrganiserNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllOrganiserNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate and refetch organiser notifications
      queryClient.invalidateQueries({ queryKey: ['notifications', 'organiser'] });
    },
  });
};

/**
 * Hook to accept any request (event join or subscription)
 * This will also refresh all player-related data
 */
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, waitlistId }: { eventId: string; waitlistId: string }) =>
      notificationService.acceptRequest(eventId, waitlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['player-events'] });
      queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event-details'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
      queryClient.invalidateQueries({ queryKey: ['search-events'] });
      queryClient.invalidateQueries({ queryKey: ['organiser-events'] });
      queryClient.invalidateQueries({ queryKey: ['top-organisers'] });
      queryClient.invalidateQueries({ queryKey: ['search-organisers'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['filter-options'] });
    },
  });
};
/**
 * Hook to reject any request (event join or subscription)
 */
export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, waitlistId }: { eventId: string; waitlistId: string }) =>
      notificationService.rejectRequest(eventId, waitlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Deprecated: Use useAcceptRequest instead
export const useAcceptEventJoinRequest = useAcceptRequest;

// Deprecated: Use useRejectRequest instead
export const useRejectEventJoinRequest = useRejectRequest;

// Deprecated: Use useAcceptRequest instead
export const useAcceptSubscription = useAcceptRequest;

// Deprecated: Use useRejectRequest instead
export const useDeclineSubscription = useRejectRequest;

/**
 * Hook to delete a notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
