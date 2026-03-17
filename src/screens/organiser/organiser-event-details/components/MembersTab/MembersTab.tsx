import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@components/global/Card';
import { ProgressBar } from '@components/global/ProgressBar';
import { colors, spacing, borderRadius, withOpaqueForAndroid } from '@theme';
import type { EventData, WaitlistEntry, EventParticipant } from '@app-types';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { ImageDs } from '@designSystem/atoms/image';
import { Avatar } from '@components';
import { RemovePlayerModal } from '../RemovePlayerModal';
import { WaitlistActionModal } from '../WaitlistActionModal';
import { PendingRequestsList } from './PendingRequestsList';
import { usePendingRequestMutations } from './use-pending-request-mutations';
import { eventService } from '@services/event-service';
import { privateEventsService } from '@services/private-events-service';
import { shareEventWithPlayers } from '@utils/share-utils';
import { formatDate, formatBookingSlot, calculateSpotsFilled } from '@utils';
import { apiClient } from '@services/api/api-client';

type MembersView = 'joined' | 'waitlisted' | 'requests';

interface MembersTabProps {
  event: EventData;
  onOpenMembersModal: () => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({ event }) => {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<MembersView>('joined');
  const [selectedPlayer, setSelectedPlayer] = useState<{ userId: number; name: string } | null>(null);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);

  // Waitlist modal state
  const [selectedWaitlistPlayer, setSelectedWaitlistPlayer] = useState<WaitlistEntry | null>(null);
  const [isWaitlistModalVisible, setIsWaitlistModalVisible] = useState(false);

  // Filter out cancelled players and normalize fields from API (handles snake_case, nested user, various field names)
  const allParticipants = (event.participants || [])
    .filter((p) => {
      const status = (p as EventParticipant & { bookingStatus?: string }).bookingStatus ?? (p as any).booking_status;
      return status !== 'cancelled';
    })
    .map((p) => {
      const raw = p as any;
      // Handle nested user: API may return { user: { userId, fullName, profilePic, ... }, guestCount, ... }
      const flat = raw.user
        ? { ...raw.user, ...raw, userId: raw.user.userId ?? raw.userId, fullName: raw.user.fullName ?? raw.fullName, profilePic: raw.user.profilePic ?? raw.profilePic }
        : { ...raw };
      const booking = raw.booking ?? raw.bookingDetails ?? {};
      const bookingSlots = Array.isArray(booking?.bookingSlots) ? booking.bookingSlots : [];
      const slots = Array.isArray(booking?.slots) ? booking.slots : [];
      const firstSlot = bookingSlots[0] ?? slots[0] ?? null;
      const slotFromNested = firstSlot
        ? { start: firstSlot.startTime ?? firstSlot.start_time ?? firstSlot.start, end: firstSlot.endTime ?? firstSlot.end_time ?? firstSlot.end }
        : null;
      // Guest count: guestCount, guest_count, guests, guestsCount, guests_count, eventTotalAttendNumber-1
      const guestCountRaw =
        flat.guestCount ??
        flat.guest_count ??
        flat.guests ??
        flat.guestsCount ??
        flat.guests_count ??
        booking.guestCount ??
        booking.guest_count ??
        booking.guests ??
        booking.guestsCount ??
        booking.guests_count;
      const guestCount =
        typeof guestCountRaw === 'number'
          ? guestCountRaw
          : typeof flat.eventTotalAttendNumber === 'number' && flat.eventTotalAttendNumber > 1
            ? flat.eventTotalAttendNumber - 1
            : typeof booking.eventTotalAttendNumber === 'number' && booking.eventTotalAttendNumber > 1
              ? booking.eventTotalAttendNumber - 1
              : 0;

      return {
        ...flat,
        guestCount,
        paymentStatus: flat.paymentStatus ?? flat.payment_status ?? null,
        slotStartTime:
          flat.slotStartTime ??
          flat.slot_start_time ??
          flat.startTime ??
          flat.start_time ??
          flat.bookingStartTime ??
          flat.booking_start_time ??
          booking.slotStartTime ??
          booking.slot_start_time ??
          booking.startTime ??
          booking.start_time ??
          slotFromNested?.start ??
          undefined,
        slotEndTime:
          flat.slotEndTime ??
          flat.slot_end_time ??
          flat.endTime ??
          flat.end_time ??
          flat.bookingEndTime ??
          flat.booking_end_time ??
          booking.slotEndTime ??
          booking.slot_end_time ??
          booking.endTime ??
          booking.end_time ??
          slotFromNested?.end ??
          undefined,
        amountPaid: flat.amountPaid ?? flat.amount_paid ?? booking.amountPaid ?? booking.amount_paid ?? undefined,
      };
    });

  // Joined = participants from API, excluding only those with explicit paymentStatus='pending'.
  // If backend doesn't send paymentStatus, treat as joined (backend is source of truth).
  const hasExplicitPaymentPending = (p: typeof allParticipants[0]) => {
    const ps = String(p.paymentStatus ?? (p as any).payment_status ?? '').toLowerCase();
    return ps === 'pending' || ps.includes('pending');
  };
  const participants = allParticipants.filter((p) => !hasExplicitPaymentPending(p));
  const spotsBooked = calculateSpotsFilled(event);
  const totalSpots = event.spotsInfo?.totalSpots || event.eventMaxGuest || 0;

  // Event date for "Booked: ..." - Figma: "23 Oct, 4:00 - 6:30 PM". Use event.eventDateTime (same as About tab).
  const eventStart = event.eventDateTime ?? (event as any).event_date_time ?? (event as any).dateTime;
  const eventEnd = event.eventEndDateTime ?? (event as any).event_end_date_time ?? eventStart;
  const eventBookingText = eventStart
    ? (formatBookingSlot(eventStart, eventEnd) || formatDate(eventStart, 'display-range', { endTime: eventEnd }))
    : null;

  const spotsAvailable = totalSpots - spotsBooked;

  // Fetch participants with joinedAt (booking time) from GET /api/events/:eventId/participants
  const { data: participantsData } = useQuery({
    queryKey: ['event-participants', event.eventId],
    queryFn: () => eventService.getEventParticipants(event.eventId),
    enabled: !!event.eventId && participants.length > 0,
  });
  const participantsWithJoinedAt = participantsData?.participants ?? [];
  const joinedAtByUserId = new Map<number, string>();
  for (const p of participantsWithJoinedAt) {
    const bookingTime = (p as any).joinedAt ?? (p as any).joined_at ?? (p as any).bookedAt ?? (p as any).booked_at ?? (p as any).createdAt ?? (p as any).created_at;
    if (bookingTime && p.userId) joinedAtByUserId.set(p.userId, bookingTime);
  }

  // Fetch waitlist data from API
  const { data: waitlistData, refetch: refetchWaitlist } = useQuery({
    queryKey: ['event-waitlist', event.eventId],
    queryFn: () =>
      event.IsPrivateEvent
        ? privateEventsService.getPendingRequests(event.eventId, 1)
        : eventService.getEventWaitlist(event.eventId),
    enabled: !!event.eventId,
  });

  const waitlist = waitlistData?.data?.waitlist || [];
  const maxWaitlist = waitlistData?.data?.counts?.availableSpots || spotsAvailable || 20;

  // Fetch pending join requests for private event (used when Requests tab is active)
  const { data: pendingRequestsData } = useQuery({
    queryKey: ['event-pending-requests', event.eventId],
    queryFn: () => eventService.getEventPendingRequests(event.eventId, 1),
    enabled: !!event.eventId,
  });

  const allPendingRequests = pendingRequestsData?.data?.pendingRequests ?? [];
  // Anyone in participants (from API) is joined - filter them from Requests
  const joinedUserIds = allParticipants.map((p) => p.userId);
  const joinedSet = new Set(joinedUserIds);
  const isRequestPaid = (r: { user: { userId: number }; paymentStatus?: string | null; payment_status?: string | null }) => {
    const s = String(r.paymentStatus ?? r.payment_status ?? '').toLowerCase();
    return s === 'paid' || s.includes('paid');
  };
  const pendingRequests = allPendingRequests.filter(
    (r) => !joinedSet.has(r.user.userId) && !isRequestPaid(r)
  );
  const totalPendingRequests = pendingRequests.length;

  // Accept waitlisted player mutation
  const acceptPlayerMutation = useMutation({
    mutationFn: ({ eventId, waitlistId }: { eventId: string; waitlistId: string }) =>
      eventService.acceptWaitlistedPlayer(eventId, waitlistId),
    onSuccess: () => {
      refetchWaitlist();
      // Invalidate event query to refresh event data (participants, spots, etc.)
      queryClient.invalidateQueries({ queryKey: ['event', event.eventId] });
      setIsWaitlistModalVisible(false);
      setSelectedWaitlistPlayer(null);
    },
  });

  // Reject waitlisted player mutation
  const rejectPlayerMutation = useMutation({
    mutationFn: ({ eventId, waitlistId }: { eventId: string; waitlistId: string }) =>
      eventService.rejectWaitlistedPlayer(eventId, waitlistId),
    onSuccess: () => {
      refetchWaitlist();
      // Invalidate event query to refresh event data
      queryClient.invalidateQueries({ queryKey: ['event', event.eventId] });
      setIsWaitlistModalVisible(false);
      setSelectedWaitlistPlayer(null);
    },
  });

  const { declinePendingRequestMutation } = usePendingRequestMutations(event.eventId);

  const handlePlayerPress = (userId: number, name: string) => {
    setSelectedPlayer({ userId, name });
    setIsRemoveModalVisible(true);
  };

  const handleWaitlistPlayerPress = (player: WaitlistEntry) => {
    setSelectedWaitlistPlayer(player);
    setIsWaitlistModalVisible(true);
  };

  const handleCloseWaitlistModal = () => {
    setIsWaitlistModalVisible(false);
    setSelectedWaitlistPlayer(null);
  };

  const handleAcceptPlayer = () => {
    if (!selectedWaitlistPlayer) {
      return;
    }
    acceptPlayerMutation.mutate({
      eventId: event.eventId,
      waitlistId: selectedWaitlistPlayer.waitlistId,
    });
  };

  const handleRejectPlayer = () => {
    if (!selectedWaitlistPlayer) {
      return;
    }
    rejectPlayerMutation.mutate({
      eventId: event.eventId,
      waitlistId: selectedWaitlistPlayer.waitlistId,
    });
  };

  const handleCloseRemoveModal = () => {
    setIsRemoveModalVisible(false);
    setSelectedPlayer(null);
  };

  const removePlayerMutation = useMutation({
    mutationFn: ({ eventId, playerId }: { eventId: string; playerId: number }) =>
      event.IsPrivateEvent
        ? privateEventsService.removePlayer(eventId, playerId)
        : eventService.removeParticipant(eventId, String(playerId)),
    onSuccess: () => {
      handleCloseRemoveModal();
      queryClient.invalidateQueries({ queryKey: ['event', event.eventId] });
    },
  });

  const handleConfirmRemove = () => {
    if (!selectedPlayer) {
      return;
    }
    removePlayerMutation.mutate(
      { eventId: event.eventId, playerId: selectedPlayer.userId },
      {
        onError: (error) => {
          console.error('Error removing player:', error);
        },
      }
    );
  };

  const handleShareJoinedPlayers = () => {
    shareEventWithPlayers({
      eventId: event.eventId,
      eventName: event.eventName,
      creatorName: event.eventCreatorName,
      formattedDateTime: formatDate(event.eventDateTime ?? '', 'display-range'),
      eventLocation: event.eventLocation,
      participantNames: participants.map((p) => p.fullName),
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Stats Cards Row - Clickable Tabs */}
      <FlexView row gap={spacing.md} mb={spacing.base}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setActiveView('joined')}
          activeOpacity={0.7}
        >
          <Card style={
            activeView === 'joined'
              ? { ...styles.statCard, ...styles.activeStatCard }
              : styles.statCard
          }>
            <TextDs
              size={14} weight="regular"
              color={activeView === 'joined' ? 'white' : 'primary'}
              style={styles.statNumber}
            >
              {spotsBooked}
            </TextDs>
            <TextDs
              size={14} weight="regular"
              color={activeView === 'joined' ? 'white' : 'secondary'}
            >
              Joined
            </TextDs>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setActiveView('requests')}
          activeOpacity={0.7}
        >
          <Card style={
            activeView === 'requests'
              ? { ...styles.statCard, ...styles.activeStatCard }
              : styles.statCard
          }>
            <TextDs
              size={14} weight="regular"
              color={activeView === 'requests' ? 'white' : 'primary'}
              style={styles.statNumber}
            >
              {totalPendingRequests}
            </TextDs>
            <TextDs
              size={14} weight="regular"
              color={activeView === 'requests' ? 'white' : 'secondary'}
            >
              Requests
            </TextDs>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setActiveView('waitlisted')}
          activeOpacity={0.7}
        >
          <Card style={
            activeView === 'waitlisted'
              ? { ...styles.statCard, ...styles.activeStatCard }
              : styles.statCard
          }>
            <TextDs
              size={14} weight="regular"
              color={activeView === 'waitlisted' ? 'white' : 'primary'}
              style={styles.statNumber}
            >
              {waitlist.length}
            </TextDs>
            <TextDs
              size={14} weight="regular"
              color={activeView === 'waitlisted' ? 'white' : 'secondary'}
            >
              Waitlisted
            </TextDs>
          </Card>
        </TouchableOpacity>
      </FlexView>

      {/* Progress Bar Section */}
      <FlexView style={styles.progressSection}>
        <FlexView row justifyContent="space-between" alignItems="center" mb={spacing.xs}>
          {activeView === 'joined' || activeView === 'requests' ? (
            <>
              <TextDs size={14} weight="regular" color={spotsBooked >= totalSpots ? 'primary' : 'primary'}>
                {spotsBooked}/{totalSpots}
              </TextDs>
              <TextDs size={14} weight="regular" color="success">
                {spotsBooked >= totalSpots ? 'Waitlist Closed' : 'Spots Available'}
              </TextDs>
            </>
          ) : (
            <>
              <TextDs size={14} weight="regular" color="error">
                {waitlist.length}/{maxWaitlist}
              </TextDs>
              <TextDs size={14} weight="regular" color="error">
                {waitlist.length >= maxWaitlist ? 'Waitlist Full' : 'Waitlist Open'}
              </TextDs>
            </>
          )}
        </FlexView>
        <ProgressBar
          current={activeView === 'joined' ? spotsBooked : waitlist.length}
          total={activeView === 'joined' ? totalSpots : maxWaitlist}
          barStyle={{
            backgroundColor: activeView === 'joined'
              ? (spotsBooked >= totalSpots ? colors.status.error : colors.status.success)
              : colors.status.error
          }}
        />
      </FlexView>

      {/* Players Section - Changes based on activeView */}
      {activeView === 'joined' && (
        <>
          <FlexView row justifyContent="space-between" alignItems="center" mt={spacing.lg} mb={spacing.base}>
            <TextDs size={14} weight="regular" color="primary">
              Joined Players
            </TextDs>
            <TouchableOpacity
              style={styles.whatsappButton}
              activeOpacity={0.7}
              onPress={handleShareJoinedPlayers}
            >
              <ImageDs image="whatsappIcon" size={22} />
            </TouchableOpacity>
          </FlexView>

          {participants.length > 0 ? (
            <FlexView style={styles.playersList}>
              {participants.map((participant) => {
                const p = participant as EventParticipant & { guestCount?: number; slotStartTime?: string; slotEndTime?: string; amountPaid?: number };
                const guestCount = p.guestCount ?? (participant as any).guest_count ?? 0;
                const hasGuest = guestCount > 0;
                const guestSuffix = hasGuest ? ` +${guestCount}` : '';
                const hasSlot = !!(p.slotStartTime);
                const joinedAt =
                  joinedAtByUserId.get(participant.userId) ??
                  (participant as any).joinedAt ??
                  (participant as any).joined_at ??
                  (participant as any).bookedAt ??
                  (participant as any).booked_at ??
                  (participant as any).booking?.joinedAt ??
                  (participant as any).booking?.joined_at;
                const bookingText =
                  hasSlot
                    ? formatBookingSlot(p.slotStartTime!, p.slotEndTime)
                    : joinedAt
                      ? (formatBookingSlot(joinedAt, undefined) || formatDate(joinedAt, 'display-range'))
                      : eventBookingText;
                const amountPaid = p.amountPaid ?? (participant as any).amount_paid;
                const displayPrice =
                  amountPaid != null && amountPaid > 0
                    ? Math.round(amountPaid)
                    : event.eventPricePerGuest ?? 0;

                return (
                  <TouchableOpacity
                    key={participant.userId}
                    style={styles.playerItem}
                    activeOpacity={0.7}
                    onPress={() => handlePlayerPress(participant.userId, participant.fullName)}
                  >
                    <FlexView position="relative">
                      <Avatar
                        imageUri={participant.profilePic}
                        fullName={participant.fullName}
                        size="xl"
                      />

                      {/* Guest Count Badge */}
                      {hasGuest && (
                        <FlexView style={styles.guestCountBadge}>
                          <TextDs style={styles.guestCountText}>
                            +{guestCount}
                          </TextDs>
                        </FlexView>
                      )}

                      {/* Remove Button Badge */}
                      <FlexView position="absolute" bottom={-2} right={-2}>
                        <TouchableOpacity
                          style={styles.glassMinusTouchable}
                          activeOpacity={0.7}
                          disabled={removePlayerMutation.isPending}
                          onPress={() => {
                            if (participant.userId) {
                              handlePlayerPress(participant.userId, participant.fullName);
                            }
                          }}
                        >
                          <ImageDs image="glassMinus" size={20} />
                        </TouchableOpacity>
                      </FlexView>
                    </FlexView>
                    <FlexView flex={1} style={styles.playerContent} minWidth={0}>
                    <TextDs
                      size={14}
                      weight="semibold"
                      color="primary"
                      numberOfLines={1}
                    >
                      {participant.fullName}{guestSuffix}
                    </TextDs>
                    <TextDs
                      size={12}
                      weight="regular"
                      color="secondary"
                      style={styles.bookingText}
                      numberOfLines={1}
                    >
                      Booked: {bookingText || eventBookingText || '—'}
                    </TextDs>
                  </FlexView>
                  <FlexView row alignItems="center" gap={spacing.xs} style={styles.playerPrice}>
                    <ImageDs image="DhiramIcon" size={14} />
                    <TextDs size={14} weight="medium" color="primary">
                      {displayPrice}
                    </TextDs>
                  </FlexView>
                  </TouchableOpacity>
                );
              })}
            </FlexView>
          ) : (
            <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
              <TextDs size={14} weight="regular" color="secondary">
                No participants yet
              </TextDs>
            </Card>
          )}
        </>
      )}

      {activeView === 'requests' && (
        <>
          {pendingRequests.length > 0 ? (
            <PendingRequestsList eventId={event.eventId} joinedUserIds={joinedUserIds} />
          ) : (
            <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
              <TextDs size={14} weight="regular" color="secondary">
                No pending requests
              </TextDs>
            </Card>
          )}
        </>
      )}

      {activeView === "waitlisted" && (
        <>
          <FlexView row justifyContent="space-between" alignItems="center" mt={spacing.lg} mb={spacing.base}>
            <TextDs size={14} weight="regular" color="primary">
              Waitlisted Players
            </TextDs>
          </FlexView>

          {waitlist.length > 0 ? (
            <FlexView style={styles.playersList}>
              {waitlist.map((waitlistEntry: WaitlistEntry) => (
                <TouchableOpacity
                  key={waitlistEntry.waitlistId}
                  style={styles.playerItem}
                  activeOpacity={0.7}
                  onPress={() => handleWaitlistPlayerPress(waitlistEntry)}
                >
                  <Avatar
                    imageUri={waitlistEntry.user.profilePic}
                    fullName={waitlistEntry.user.fullName}
                    size="xl"
                  />
                  <FlexView flex={1} style={styles.playerContent}>
                    <TextDs
                      size={14} weight="semibold"
                      color="primary"
                      numberOfLines={1}
                    >
                      {waitlistEntry.user.fullName}
                    </TextDs>
                    <TextDs
                      size={12} weight="regular"
                      color="secondary"
                      numberOfLines={1}
                    >
                      Waitlisted
                    </TextDs>
                  </FlexView>
                </TouchableOpacity>
              ))}
            </FlexView>
          ) : (
            <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
              <TextDs size={14} weight="regular" color="secondary">
                No one on waitlist yet
              </TextDs>
            </Card>
          )}
        </>
      )}

      {/* Remove Player Modal */}
      <RemovePlayerModal
        visible={isRemoveModalVisible}
        playerName={selectedPlayer?.name || ''}
        onClose={handleCloseRemoveModal}
        onConfirm={handleConfirmRemove}
        isLoading={removePlayerMutation.isPending}
      />

      {/* Waitlist Action Modal */}
      <WaitlistActionModal
        visible={isWaitlistModalVisible}
        playerName={selectedWaitlistPlayer?.user.fullName || ''}
        playerProfilePic={selectedWaitlistPlayer?.user.profilePic || null}
        onClose={handleCloseWaitlistModal}
        onAccept={handleAcceptPlayer}
        onReject={handleRejectPlayer}
        isLoading={acceptPlayerMutation.isPending || rejectPlayerMutation.isPending}
      />
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  statCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  activeStatCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statNumber: {
    marginBottom: spacing.xs,
  },
  progressSection: {
    marginBottom: spacing.base,
  },
  whatsappButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playersList: {
    gap: spacing.sm,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.7)'),
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  playerContent: {
    marginRight: spacing.sm,
  },
  playerPrice: {
    marginLeft: 'auto',
  },
  bookingText: {
    marginTop: 2,
  },
  playerName: {
    textAlign: 'center',
  },
  playerAvatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.xs,
  },
  glassMinusTouchable: {
    padding: 0,
  },
  guestCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: 4,
    height: 18,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.text.white,
    zIndex: 2,
  },
  guestCountText: {
    color: colors.text.white,
    fontSize: 9,
    fontWeight: '700',
  },
});
