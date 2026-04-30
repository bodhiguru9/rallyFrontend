import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService, type PlayerBookingsParams } from '@services/booking-service';

interface UsePlayerBookingsOptions extends PlayerBookingsParams {
  enabled?: boolean;
}

/**
 * Hook to fetch player bookings
 * @param options - Query parameters (status, page) and enabled flag
 * @returns React Query result with bookings data
 */
export const usePlayerBookings = (options?: UsePlayerBookingsOptions) => {
  const { enabled = true, ...params } = options || {};

  return useQuery({
    queryKey: ['player-bookings', params?.status || 'all', params?.page || 1],
    queryFn: () => bookingService.getPlayerBookings(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
};

/**
 * Mutation hook to cancel a booking (POST /api/bookings/:bookingId/cancel).
 * Invalidates event details and player bookings on success.
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['event-details'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
    onError: () => {
      // Even on error (e.g., "already cancelled" or client timeout),
      // invalidate so the UI reflects the current backend state on refetch.
      queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['event-details'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
};
