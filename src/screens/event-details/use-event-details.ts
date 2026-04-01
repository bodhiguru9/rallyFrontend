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
  const { eventId, occurrenceStart, occurrenceEnd } = route.params;

  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isOrganiser = user?.userType === 'organiser';

  // Fetch my invitations first so we can check if I'm invited
  const { data: invitesData, isLoading: isInvitesLoading } = useMyEventInvitations();

  // Check for ANY invitation (pending or accepted) — not just pending
  const myInvitation = invitesData?.invitations?.find(
    (inv) => {
      const match = (inv.inviteId ?? inv.event?.eventId) === eventId;
      return match && (inv.status === 'pending' || inv.status === 'accepted');
    }
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

  // Check if user is already joined and has a booking for THIS specific occurrence
  const joinedBooking = playerBookingsData?.data?.bookings?.find(b => {
    const matchEvent = b.eventId === eventId;
    if (!matchEvent) return false;

    // If we are looking for a specific occurrence, match it
    if (occurrenceStart) {
      return (b.booking as any)?.occurrenceStart === occurrenceStart;
    }

    // Otherwise match the parent/default (legacy or first instance)
    return !(b.booking as any)?.occurrenceStart || (b.booking as any)?.occurrenceStart === event?.eventDateTime;
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
      if (!pendingInvitation) {
        navigation.navigate('Home');
      }
    }
  }, [error, isLoading, isInvitesLoading, pendingInvitation, navigation]);

  // Sync guestsCount with actual booking if already joined
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (playerBookingsData) {
      logger.info('useEventDetails: playerBookingsData found', {
        count: playerBookingsData?.data?.bookings?.length,
        eventId,
        found: !!joinedBooking
      });
    }

    if (joinedBooking) {
      const currentUserParticipant = event?.participants?.find(p => p.userId === user?.userId);

      const bookedGuests =
        (joinedBooking as any)?.eventTotalAttendNumber ??
        joinedBooking.booking?.guestsCount ??
        (joinedBooking.booking as any)?.guestsCount ??
        (joinedBooking.booking as any)?.guests ??
        (joinedBooking.booking as any)?.guestCount ??
        (joinedBooking as any)?.guestsCount ??
        (joinedBooking as any)?.guests ??
        (joinedBooking as any)?.guestCount ??
        (currentUserParticipant as any)?.guestsCount ??
        (currentUserParticipant as any)?.guests ??
        1;

      if (guestsCount !== bookedGuests) {
        timeoutId = setTimeout(() => {
          setGuestsCount(bookedGuests);
        }, 0);
        return () => { if (timeoutId) clearTimeout(timeoutId); };
      }
      return;
    }

    if (event) {
      if (event.eventOurGuestAllowed === false && guestsCount !== 1) {
        timeoutId = setTimeout(() => setGuestsCount(1), 0);
      } else if (guestsCount === 0 && event.eventOurGuestAllowed === true) {
        timeoutId = setTimeout(() => setGuestsCount(1), 0);
      }

      const spotsLeft = event.spotsInfo?.spotsLeft ?? event.availableSpots ?? (event.eventMaxGuest - (event.participantsCount ?? event.spotsInfo?.spotsBooked ?? 0));
      if (spotsLeft >= 0 && guestsCount > spotsLeft && !joinedBooking) {
        timeoutId = setTimeout(() => setGuestsCount(Math.max(1, spotsLeft)), 0);
      }
    }
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [event?.eventOurGuestAllowed, event?.eventId, event?.spotsInfo?.spotsLeft, event?.availableSpots, event?.eventMaxGuest, event?.participantsCount, guestsCount, playerBookingsData, joinedBooking, user?.userId, event?.participants]);

  // Use occurrence datetime if provided, otherwise fallback to main event datetime
  const effectiveEventDateTime = occurrenceStart || event?.eventDateTime;
  const effectiveEventEndDateTime = occurrenceEnd || event?.eventEndDateTime;

  useEffect(() => {
    if (event) {
      logger.info('useEventDetails: Dates Check', {
        eventId,
        occurrenceStart,
        eventDateTime: event.eventDateTime,
        effectiveEventDateTime,
        now: new Date().toISOString()
      });
    }
  }, [event, eventId, occurrenceStart, effectiveEventDateTime]);

  const isRegistrationOpen = (() => {
    const startTime = event?.eventRegistrationStartTime;
    if (!event || startTime === null || startTime === undefined) return true;
    try {
      const isOpen = new Date() >= new Date(startTime);
      return isOpen;
    } catch (error) {
      logger.error('Error parsing registration start time:', error);
      return true;
    }
  })();

  const isRegistrationEnded = (() => {
    if (!effectiveEventDateTime) return false;
    const now = new Date();
    const eventTime = new Date(effectiveEventDateTime);

    // If the event session itself has started, registration is ended
    if (now > eventTime) {
      logger.info('isRegistrationEnded: True (Event started)', { now: now.toISOString(), eventTime: eventTime.toISOString() });
      return true;
    }

    // If there's an explicit registration end time on the event object
    if (event?.eventRegistrationEndTime) {
      try {
        const regEndTime = new Date(event.eventRegistrationEndTime);
        if (now > regEndTime) {
          // Dynamic Override for Recurring Events:
          // If the series-level registration deadline has passed, but we are looking at a 
          // specific future occurrence that hasn't started yet, we allow registration.
          // This handles cases where the deadline was meant for the first session of the series.
          if (occurrenceStart && eventTime > now) {
            logger.info('isRegistrationEnded: False (Ignoring past series deadline for future occurrence)', {
              now: now.toISOString(),
              regEndTime: regEndTime.toISOString(),
              occurrenceStart
            });
            return false;
          }

          logger.info('isRegistrationEnded: True (Registration deadline passed)', { now: now.toISOString(), regEndTime: regEndTime.toISOString() });
          return true;
        }
      } catch (error) {
        logger.error('Error parsing registration end time:', error);
      }
    }
    return false;
  })();

  const handleShare = () => {
    if (event) {
      shareEvent({
        eventId: event.eventId ?? eventId,
        eventName: event.eventName ?? 'Event',
        creatorName: event.creator?.fullName ?? event.eventCreatorName ?? '',
        formattedDateTime: formatDate(effectiveEventDateTime ?? '', 'display-range'),
        eventLocation: event.eventLocation ?? undefined,
      });
    }
  };

  const handleSignIn = () => navigation.navigate('SignIn');
  const handleCloseBookingModal = () => setIsBookingModalVisible(false);

  const handleBookEvent = (paymentData?: BookingModalPaymentPayload) => {
    if (!event || !paymentData) return;
    queryClient.invalidateQueries({ queryKey: ['player-bookings'] });
    queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
    queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    setIsBookingModalVisible(false);

    navigation.navigate('BookingConfirmation', {
      eventId: event.eventId ?? eventId,
      bookingId: paymentData.bookingId || generateBookingId(),
      amountPaid: paymentData.amount ?? totalPrice,
      currency: paymentData.currency || 'AED',
      guestsCount: guestsCount,
      subtotal: paymentData.subtotal,
      vatAmount: paymentData.vatAmount,
      discountAmount: paymentData.discountAmount,
    });
  };

  const handleApplePay = () => logger.info('Apple Pay selected');

  const handleBookNow = async () => {
    if (!event) return;
    if (!isAuthenticated) { handleSignIn(); return; }
    if (!!joinedBooking) return;

    await queryClient.refetchQueries({ queryKey: ['event', eventId, true, true] });
    const freshEvent = queryClient.getQueryData<typeof event>(['event', eventId, true, true]);
    const ev = freshEvent ?? event;

    if (ev.isPending && !(ev.userJoinStatus?.inWaitlist && !ev.spotsInfo?.spotsFull)) {
      logger.info('Join request is pending approval');
      return;
    }

    if (ev.userJoinStatus?.hasRequest) {
      logger.info('Join request already sent');
      return;
    }

    if (!isRegistrationOpen) {
      addReminder(ev.eventId ?? eventId, {
        onSuccess: () => {
          navigation.navigate('RequestSent', {
            variant: 'registration',
            eventId: ev.eventId ?? eventId,
            eventTitle: ev.eventName ?? 'Event',
            organizerName: ev.creator?.fullName || ev.eventCreatorName || 'Unknown Organizer',
            eventImage: ev.eventImages?.[0] || ev.gameImages?.[0] || 'https://via.placeholder.com/150',
            eventDate: formatDate(effectiveEventDateTime ?? '', 'display-range'),
            eventLocation: ev.eventLocation ?? '',
            amountDue: totalPrice,
            currency: 'AED',
            bookingId: generateBookingId(),
            categories: ev.eventSports ?? [],
            eventType: ev.eventType ?? 'Event',
          });
        },
      });
      return;
    }

    const spotsLeft = ev.spotsInfo?.spotsLeft ?? ev.availableSpots ?? Math.max(0, (ev.eventMaxGuest ?? 0) - (ev.participantsCount ?? ev.spotsInfo?.spotsBooked ?? 0));
    if (ev.spotsInfo?.spotsFull || spotsLeft <= 0) {
      joinWaitlist(eventId, {
        onSuccess: () => {
          navigation.navigate('RequestSent', {
            variant: 'waitlist',
            eventId: ev.eventId ?? eventId,
            eventTitle: ev.eventName ?? 'Event',
            organizerName: ev.creator?.fullName || ev.eventCreatorName || 'Unknown Organizer',
            eventImage: ev.eventImages?.[0] || ev.gameImages?.[0] || 'https://via.placeholder.com/150',
            eventDate: formatDate(effectiveEventDateTime ?? '', 'display-range'),
            eventLocation: ev.eventLocation ?? '',
            amountDue: totalPrice,
            currency: 'AED',
            bookingId: generateBookingId(),
            categories: ev.eventSports ?? [],
            eventType: ev.eventType ?? 'Event',
          });
        },
      });
      return;
    }

    if (guestsCount > spotsLeft) setGuestsCount(Math.max(1, spotsLeft));

    if (ev.IsPrivateEvent || ev.eventApprovalReq) {
      sendJoinRequest(eventId, {
        onSuccess: () => {
          navigation.navigate('RequestSent', {
            variant: 'private',
            eventId: ev.eventId ?? eventId,
            eventTitle: ev.eventName ?? 'Event',
            organizerName: ev.creator?.fullName || ev.eventCreatorName || 'Unknown Organizer',
            eventImage: ev.eventImages?.[0] || ev.gameImages?.[0] || 'https://via.placeholder.com/150',
            eventDate: formatDate(effectiveEventDateTime ?? '', 'display-range'),
            eventLocation: ev.eventLocation ?? '',
            amountDue: totalPrice,
            currency: 'AED',
            bookingId: generateBookingId(),
            categories: ev.eventSports ?? [],
            eventType: ev.eventType ?? 'Event',
          });
        },
      });
      return;
    }

    setIsBookingModalVisible(true);
  };

  const generateBookingId = () => {
    const r1 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const r2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `#RLY-${r1}-${r2}`;
  };

  const handleOpenMembersModal = () => setIsMembersModalVisible(true);
  const handleCloseMembersModal = () => setIsMembersModalVisible(false);

  const getRefundDeadline = (): Date | null => {
    if (!effectiveEventDateTime) return null;
    return new Date(new Date(effectiveEventDateTime).getTime() - 24 * 60 * 60 * 1000);
  };

  const hasRefundPeriodPassed = (): boolean => {
    const deadline = getRefundDeadline();
    return deadline ? new Date() > deadline : false;
  };

  const isPastCancellationTime = (): boolean => effectiveEventDateTime ? new Date() >= new Date(effectiveEventDateTime) : false;
  const getRefundDate = (): string => {
    const deadline = getRefundDeadline();
    return deadline ? formatDate(deadline, 'display') : '—';
  };

  const handleCloseCancelBookingModal = () => setIsCancelBookingModalVisible(false);
  const handleCancelBookingSuccess = () => {
    setIsCancelBookingModalVisible(false);
    navigation.navigate('PlayerCalendar');
  };

  const cancelVariant: 'noRefund' | 'cancelSession' = hasRefundPeriodPassed() ? 'noRefund' : 'cancelSession';

  const handleCancelBooking = () => {
    if (!event || isPastCancellationTime()) return;
    setIsCancelBookingModalVisible(true);
  };

  const totalPrice = event?.eventPricePerGuest ? event.eventPricePerGuest * guestsCount : 0;

  const getButtonText = (): string => {
    if (isLeavingEvent) return 'Leaving...';
    if (isAddingReminder) return 'Adding Reminder...';
    if (isJoiningWaitlist) return 'Joining Waitlist...';
    if (isSendingJoinRequest) return 'Sending Request...';
    if (isBookingEvent) return 'Booking...';
    if (!event) return 'Loading...';
    if (!!joinedBooking) return 'Leave Event';
    if (pendingInvitation) return 'Accept Invitation';
    if (event.isPending) {
      if (event.userJoinStatus?.inWaitlist && !event.spotsInfo?.spotsFull) return 'Pay Now';
      return 'Request Pending';
    }
    if (event.userJoinStatus?.hasRequest) return 'Request Sent';
    if (event.isLeave) {
      if (!isRegistrationOpen) return 'Add Reminder';
      if (event.spotsInfo?.spotsFull) return 'Join Waitlist';
      return event.IsPrivateEvent || event.eventApprovalReq ? 'Request to Join' : 'Book Now';
    }
    if (isRegistrationEnded) return 'Registration Ended';
    if (!isRegistrationOpen) return 'Add Reminder';
    if (event.spotsInfo?.spotsFull) return 'Join Waitlist';
    if (event.IsPrivateEvent || event.eventApprovalReq) return 'Request to Join';
    return 'Book Now';
  };

  const getVariant = (): 'waitlist' | 'registration' | 'private' | null => {
    if (!event || !!joinedBooking || event.userJoinStatus?.action === 'payment-pending') return null;
    if (event.spotsInfo?.spotsFull) return 'waitlist';
    if (!isRegistrationOpen) return 'registration';
    if (event.IsPrivateEvent || event.eventApprovalReq) return 'private';
    return null;
  };

  const showPayNow = event?.userJoinStatus?.action === 'payment-pending' || (!!joinedBooking && event?.payment?.status === 'none');

  const handlePayNow = () => {
    navigation.navigate('Booking', { eventId, totalPrice, currency: 'AED', guestsCount });
  };

  return {
    event: event ? {
      ...event,
      eventDateTime: effectiveEventDateTime,
      eventEndDateTime: effectiveEventEndDateTime,
      isJoined: !!joinedBooking,
    } : undefined,
    isLoading,
    error,
    isAuthenticated,
    user,
    isOrganiser,
    isRegistrationOpen,
    isRegistrationEnded,
    eventId,
    occurrenceStart: occurrenceStart ?? null,
    occurrenceEnd: occurrenceEnd ?? null,
    pendingInvitation,
    guestsCount,
    setGuestsCount,
    isPaymentExpanded,
    setIsPaymentExpanded,
    isMembersModalVisible,
    totalPrice,
    variant: getVariant(),
    buttonText: getButtonText(),
    isBookingModalVisible,
    handleCloseBookingModal,
    isAddingReminder,
    isJoiningWaitlist,
    isSendingJoinRequest,
    isBookingEvent,
    isLeavingEvent,
    acceptInvitationMutation,
    declineInvitationMutation,
    handleShare,
    handleSignIn,
    handleBookNow,
    handleOpenMembersModal,
    handleCloseMembersModal,
    getRefundDate,
    handleBookEvent,
    handleApplePay,
    showPayNow,
    handlePayNow,
    canCancelBooking: !isPastCancellationTime(),
    isCancelBookingModalVisible,
    handleCloseCancelBookingModal,
    handleCancelBooking,
    handleCancelBookingSuccess,
    cancelVariant,
    cancelBookingId: joinedBooking?.booking?.bookingId ?? event?.booking?.bookingId ?? event?.payment?.bookingId,
  };
};
