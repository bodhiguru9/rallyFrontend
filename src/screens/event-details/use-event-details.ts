import type { BookingModalPaymentPayload } from "./BookingModal/BookingModal.types"; // Adjust path as needed
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@store/auth-store';
import {
  useEvent,
  useSendPrivateEventJoinRequest,
  useJoinWaitlist,
  useAddEventReminder,
  useBookEvent,
  useLeaveEvent,
} from '@hooks/use-events';
import { usePlayerBookings } from '@hooks/use-bookings';
import { useMyEventInvitations, useAcceptEventInvitation, useDeclineEventInvitation } from '@hooks/use-event-invites'; 
import { formatDate, shareEvent } from '@utils';
import { logger } from '@dev-tools/logger';

type EventDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EventDetails'
>;

type EventDetailsRouteProp = NativeStackScreenProps<RootStackParamList, 'EventDetails'>['route'];

export const useEventDetails = () => {
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const navigation = useNavigation<EventDetailsScreenNavigationProp>();
  const route = useRoute<EventDetailsRouteProp>();
  const { eventId } = route.params;

  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch my invitations first so we can check if I'm invited
  const { data: invitesData, isLoading: isInvitesLoading } = useMyEventInvitations();
  
  // Check for ANY invitation (pending or accepted) — not just pending
  const myInvitation = invitesData?.invitations?.find(
    (inv) => (inv.inviteId ?? inv.event.eventId) === eventId && (inv.status === 'pending' || inv.status === 'accepted')
  );
  const pendingInvitation = myInvitation?.status === 'pending' ? myInvitation : undefined;



  // Always allow private events — the backend handles access control.
  // The frontend should not block viewing private events for authenticated users.
  const { data: event, isLoading, error } = useEvent(eventId, { 
    forPlayer: true, 
    allowPrivate: true   // Backend is the source of truth for access control
  });



  const { data: playerBookingsData } = usePlayerBookings({
    enabled: isAuthenticated && !!eventId,
  });

  const [guestsCount, setGuestsCount] = useState(1);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [isCancelBookingModalVisible, setIsCancelBookingModalVisible] = useState(false);

  const { mutate: sendJoinRequest, isPending: isSendingJoinRequest } =
    useSendPrivateEventJoinRequest();

  const { mutate: joinWaitlist, isPending: isJoiningWaitlist } = useJoinWaitlist();

  const { mutate: addReminder, isPending: isAddingReminder } = useAddEventReminder();

  const { isPending: isBookingEvent } = useBookEvent();

  const { mutate: leaveEvent, isPending: isLeavingEvent } = useLeaveEvent();

  const acceptInvitationMutation = useAcceptEventInvitation();
  const declineInvitationMutation = useDeclineEventInvitation();

  useEffect(() => {
    // Only redirect if there's genuinely an error fetching (like 404), and we're not invited
    if (error && !isLoading && !isInvitesLoading) {
      // If error is "Event not found" and it's a private event, we only redirect if we 
      // definitely don't have a pending invitation.
      if (!pendingInvitation) {

        navigation.navigate('Home');
      }
    }
  }, [error, isLoading, isInvitesLoading, pendingInvitation, navigation]);

  // Reset guestsCount when event doesn't allow guests
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (event) {
      // If guests are not allowed (eventOurGuestAllowed is false), set to 0
      if (event.eventOurGuestAllowed === false && guestsCount !== 0) {
        timeoutId = setTimeout(() => {
          setGuestsCount(0);
        }, 0);
      } else if (guestsCount === 0 && event.eventOurGuestAllowed === true) {
        // If guests are allowed and current count is 0, reset to 1
        timeoutId = setTimeout(() => {
          setGuestsCount(1);
        }, 0);
      }
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.eventOurGuestAllowed, event?.eventId, guestsCount]);

  // Check if registration is open by comparing current time with registration start time
  const isRegistrationOpen = (() => {
    const startTime = event?.eventRegistrationStartTime;
    if (!event || startTime === null || startTime === undefined) {
      return true;
    }
    try {
      const currentTime = new Date();
      const registrationStartTime = new Date(startTime);
      return currentTime >= registrationStartTime;
    } catch (error) {
      logger.error('Error parsing registration start time:', error);
      return true; // Default to true if parsing fails
    }
  })();

  const handleShare = () => {
    if (event) {
      shareEvent({
        eventId: event.eventId ?? eventId,
        eventName: event.eventName ?? 'Event',
        creatorName: event.creator?.fullName ?? event.eventCreatorName ?? '',
        formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range'),
        eventLocation: event.eventLocation ?? undefined,
      });
    }
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

const handleCloseBookingModal = () => {
  setIsBookingModalVisible(false);
};

const handleBookEvent = (paymentData?: BookingModalPaymentPayload) => {
  if (!event || !paymentData) {
    return;
  }

  // Payment already processed and verified in BookingModal
  // Invalidate queries so calendar and event details reflect the new booking
  queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
  queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
  queryClient.invalidateQueries({ queryKey: ['event', eventId] });
  queryClient.invalidateQueries({ queryKey: ['user-profile'] });

  // Just close modal and navigate to success screen
  setIsBookingModalVisible(false);
  
  navigation.navigate('BookingConfirmation', {
    eventId: event.eventId ?? eventId,
    bookingId: paymentData.bookingId || generateBookingId() || '',
    amountPaid: paymentData.amount ?? totalPrice,
    currency: paymentData.currency || 'AED',
    guestsCount: guestsCount,
  });
};

const handleApplePay = () => {
  // Apple Pay logic can be added here when ready
  logger.info('Apple Pay selected');
};

  const handleBookNow = () => {
    if (!event) {
      return;
    }

    if (!isAuthenticated) {
      handleSignIn();
      return;
    }

    // When user has joined, cancel is handled by handleCancelBooking (refund / no-refund flow)
    if (event.isJoined) {
      return;
    }

    // Check if request is pending
    if (event.isPending) {
      // Exception: User is in waitlist and a spot just opened up!
      if (event.userJoinStatus?.inWaitlist && !event.spotsInfo?.spotsFull) {
        // Allow them to proceed to booking modal!
      } else {
        logger.info('Join request is pending approval');
        return;
      }
    }

    // Check if user has already sent a join request (hasRequest from API)
    if (event.userJoinStatus?.hasRequest) {
      logger.info('Join request already sent');
      return;
    }

    // Check if user has left (can rejoin)
    if (event.isLeave) {
      // User previously left, can rejoin - treat as new join
      // Fall through to normal join flow
    }

    if (!isRegistrationOpen) {
      addReminder(eventId, {
        onSuccess: () => {
          navigation.navigate('RequestSent', {
            variant: 'registration',
            eventId: event.eventId ?? eventId,
            eventTitle: event.eventName ?? 'Event',
            organizerName: event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer',
            eventImage:
              event.eventImages?.[0] || event.gameImages?.[0] || 'https://via.placeholder.com/150',
            eventDate: formatDate(event.eventDateTime ?? '', 'display-range'),
            eventLocation: event.eventLocation ?? '',
            amountDue: totalPrice,
            currency: 'AED',
            bookingId: generateBookingId() ?? '',
            categories: event.eventSports ?? [],
            eventType: event.eventType ?? 'Event',
          });
        },
        onError: (error: Error) => {
          logger.error('Failed to add reminder:', error);
        },
      });
      return;
    }

    if (event.spotsInfo?.spotsFull) {
      joinWaitlist(eventId, {
        onSuccess: () => {
          navigation.navigate('RequestSent', {
            variant: 'waitlist',
            eventId: event.eventId ?? eventId,
            eventTitle: event.eventName ?? 'Event',
            organizerName: event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer',
            eventImage:
              event.eventImages?.[0] || event.gameImages?.[0] || 'https://via.placeholder.com/150',
            eventDate: formatDate(event.eventDateTime ?? '', 'display-range'),
            eventLocation: event.eventLocation ?? '',
            amountDue: totalPrice,
            currency: 'AED',
            bookingId: generateBookingId() ?? '',
            categories: event.eventSports ?? [],
            eventType: event.eventType ?? 'Event',
          });
        },
        onError: (error: Error) => {
          logger.error('Failed to join waitlist:', error);
        },
      });
      return;
    }

    if (event.IsPrivateEvent || event.eventApprovalReq) {
      const requestSentParams = {
        variant: 'private' as const,
        eventId: event.eventId ?? eventId,
        eventTitle: event.eventName ?? 'Event',
        organizerName: event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer',
        eventImage:
          event.eventImages?.[0] || event.gameImages?.[0] || 'https://via.placeholder.com/150',
        eventDate: formatDate(event.eventDateTime ?? '', 'display-range'),
        eventLocation: event.eventLocation ?? '',
        amountDue: totalPrice,
        currency: 'AED',
        bookingId: generateBookingId() ?? '',
        categories: event.eventSports ?? [],
        eventType: event.eventType ?? 'Event',
      };
      sendJoinRequest(eventId, {
        onSuccess: () => {
          queryClient
            .refetchQueries({ queryKey: ['event', eventId] })
            .then(() => {
              navigation.navigate('RequestSent', requestSentParams);
            })
            .catch((err) => {
              logger.error('Failed to refetch event after join request:', err);
              navigation.navigate('RequestSent', requestSentParams);
            });
        },
        onError: (error: Error) => {
          logger.error('Failed to send join request:', error);
        },
      });
      return;
    }

    // Default: Navigate to booking screen for public events with available spots (ready to book)
    // Default: Open booking modal for public events with available spots (ready to book)
  setIsBookingModalVisible(true);
  };
  

  const generateBookingId = () => {
    // Generate a booking ID in format: #RLY-XXXXXX-XXXX
    const randomNum1 = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    const randomNum2 = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `#RLY-${randomNum1}-${randomNum2}`;
  };

  const handleOpenMembersModal = () => {
    setIsMembersModalVisible(true);
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalVisible(false);
  };

  /** Refund deadline: 24 hours before event start. Used for display and to decide if cancel shows no-refund modal. */
  const getRefundDeadline = (): Date | null => {
    if (!event?.eventDateTime) {
      return null;
    }
    const eventStart = new Date(event.eventDateTime);
    const deadline = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
    return deadline;
  };

  const hasRefundPeriodPassed = (): boolean => {
    const deadline = getRefundDeadline();
    if (!deadline) {
      return false;
    }
    return new Date() > deadline;
  };

  /** True when event has started; user can no longer cancel. Cancel button should be disabled. */
  const isPastCancellationTime = (): boolean => {
    if (!event?.eventDateTime) {
      return false;
    }
    return new Date() >= new Date(event.eventDateTime);
  };

  const getRefundDate = (): string => {
    const deadline = getRefundDeadline();
    if (!deadline) {
      return '—';
    }
    return formatDate(deadline, 'display');
  };

  const handleCloseCancelBookingModal = () => {
    setIsCancelBookingModalVisible(false);
  };

  /** Called after cancel booking API succeeds – close modal and go home. */
  const handleCancelBookingSuccess = () => {
    setIsCancelBookingModalVisible(false);
    navigation.navigate('PlayerCalendar');
  };

  /** Cancel booking: if refund date passed show cancel-booking modal (no refund); else call leave API. */
  const handleCancelBooking = () => {
    if (!event) {
      return;
    }
    if (isPastCancellationTime()) {
      return; // Button is disabled; no-op if somehow called
    }
    if (hasRefundPeriodPassed()) {
      setIsCancelBookingModalVisible(true);
      return;
    }
    leaveEvent(eventId, {
      onSuccess: () => {
        logger.info('Booking cancelled');
        navigation.navigate('PlayerCalendar');
      },
      onError: (err: Error) => {
        logger.error('Failed to cancel booking', err);
      },
    });
  };

  const totalPrice = event?.eventPricePerGuest ? event.eventPricePerGuest * guestsCount : 0;

  // Get button text based on current state and event conditions
  const getButtonText = (): string => {
    // Loading states
    if (isLeavingEvent) {
      return 'Leaving...';
    }
    if (isAddingReminder) {
      return 'Adding Reminder...';
    }
    if (isJoiningWaitlist) {
      return 'Joining Waitlist...';
    }
    if (isSendingJoinRequest) {
      return 'Sending Request...';
    }
    if (isBookingEvent) {
      return 'Booking...';
    }

    // Check if event exists
    if (!event) {
      return 'Loading...';
    }

    // Priority 1: Check if user has joined - show leave option
    if (event.isJoined) {
      return 'Leave Event';
    }

    // Priority 1b: Check if user has pending invitation
    if (pendingInvitation) {
      return 'Accept Invitation';
    }

    // Priority 2: Check if request is pending (organiser reviewing)
    if (event.isPending) {
      if (event.userJoinStatus?.inWaitlist && !event.spotsInfo?.spotsFull) {
        return 'Pay Now';
      }
      // If it's a waitlist request but spots are still full
      if (event.userJoinStatus?.inWaitlist) {
        return 'In Waitlist';
      }
      return 'Request Pending';
    }

    // Priority 2b: Check if user has sent join request (hasRequest from API)
    if (event.userJoinStatus?.hasRequest) {
      return 'Request Sent';
    }

    // Priority 3: Check if user has left (can rejoin)
    if (event.isLeave) {
      // User left, can rejoin - show join button
      if (!isRegistrationOpen) {
        return 'Add Reminder';
      }
      if (event.spotsInfo?.spotsFull) {
        return 'Join Waitlist';
      }
      if (event.IsPrivateEvent || event.eventApprovalReq) {
        return 'Request to Join';
      }
      return 'Book Now';
    }

    // Priority 4: Registration not open
    if (!isRegistrationOpen) {
      return 'Add Reminder';
    }

    // Priority 5: Event is full
    if (event.spotsInfo?.spotsFull) {
      return 'Join Waitlist';
    }

    // Priority 6: Private event or approval required
    if (event.IsPrivateEvent || event.eventApprovalReq) {
      return 'Request to Join';
    }

    // Default: Public event with available spots
    return 'Book Now';
  };

  // Determine variant based on event conditions (priority order)
  const getVariant = (): 'waitlist' | 'registration' | 'private' | null => {
    if (!event) {
      return null;
    }
    
    // Hide banner completely if user has joined or is approved and waiting for payment
    if (event.isJoined || event.userJoinStatus?.action === 'payment-pending') {
      return null;
    }

    if (event.spotsInfo?.spotsFull) {
      return 'waitlist';
    }
    if (!isRegistrationOpen) {
      return 'registration';
    }
    if (event.IsPrivateEvent || event.eventApprovalReq) {
      return 'private';
    }
    return null; // No banner needed
  };

  const variant = getVariant();
  const buttonText = getButtonText();

  // Priority: payment-pending from API → only show Pay Now; else joined but unpaid
  const isPaymentPendingAction = event?.userJoinStatus?.action === 'payment-pending';
  const showPayNow =
    isPaymentPendingAction || (!!event?.isJoined && event?.payment?.status === 'none');

  const handlePayNow = () => {
    navigation.navigate('Booking', {
      eventId,
      totalPrice,
      currency: 'AED',
      guestsCount,
    });
  };

return {
  // Data
  event,
  isLoading,
  error,
  isAuthenticated,
  isRegistrationOpen,
  eventId,
  pendingInvitation,

  // State
  guestsCount,
  setGuestsCount,
  isPaymentExpanded,
  setIsPaymentExpanded,
  isMembersModalVisible,
  totalPrice,
  variant,
  buttonText,
  isBookingModalVisible, 
  handleCloseBookingModal,

  // Loading states
  isAddingReminder,
  isJoiningWaitlist,
  isSendingJoinRequest,
  isBookingEvent,
  isLeavingEvent,

  // Mutations
  acceptInvitationMutation,
  declineInvitationMutation,

  // Handlers
  handleShare,
  handleSignIn,
  handleBookNow,
  handleOpenMembersModal,
  handleCloseMembersModal,
  getRefundDate,
  generateBookingId,
  handleBookEvent,
  handleApplePay, 
  showPayNow,
  handlePayNow,

  // Cancel booking (refund / no-refund)
  canCancelBooking: !isPastCancellationTime(),
  isCancelBookingModalVisible,
  handleCloseCancelBookingModal,
  handleCancelBooking,
  handleCancelBookingSuccess,
  cancelBookingId: (() => {
    const fromEvent = event?.booking?.bookingId ?? event?.payment?.bookingId;
    if (fromEvent) {
      return fromEvent;
    }
    const playerBooking = playerBookingsData?.data?.bookings?.find((b) => b.eventId === eventId);
    return playerBooking?.booking?.bookingId ?? undefined;
  })(),
};
};
