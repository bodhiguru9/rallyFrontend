import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@components/global/Card';
import { ProgressBar } from '@components/global/ProgressBar';
import { colors, spacing, borderRadius } from '@theme';
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

  // Filter out cancelled players and normalize guest count + payment status (API may send snake_case)
  const allParticipants = (event.participants || [])
    .filter((p) => {
      const status = (p as EventParticipant & { bookingStatus?: string }).bookingStatus ?? (p as any).booking_status;
      return status !== 'cancelled';
    })
    .map((p) => ({
      ...p,
      guestCount: p.guestCount ?? (p as any).guest_count ?? 0,
      paymentStatus: p.paymentStatus ?? (p as any).payment_status ?? null,
    }));

  // Joined = participants from API, excluding only those with explicit paymentStatus='pending'.
  // If backend doesn't send paymentStatus, treat as joined (backend is source of truth).
  const hasExplicitPaymentPending = (p: typeof allParticipants[0]) => {
    const ps = String(p.paymentStatus ?? (p as any).payment_status ?? '').toLowerCase();
    return ps === 'pending' || ps.includes('pending');
  };
  const participants = allParticipants.filter((p) => !hasExplicitPaymentPending(p));
  const spotsBooked = calculateSpotsFilled(event);
  const totalSpots = event.spotsInfo?.totalSpots || event.eventMaxGuest || 0;
  const spotsAvailable = totalSpots - spotsBooked;

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
              <TextDs size={14} weight="regular" color={spotsBooked >= totalSpots ? 'error' : 'primary'}>
                {spotsBooked}/{totalSpots}
              </TextDs>
              <TextDs size={14} weight="regular" color={spotsBooked >= totalSpots ? 'error' : 'success'}>
                {spotsBooked >= totalSpots ? 'Fully Booked: Waitlist Open' : 'Spots Available'}
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
            <FlexView style={styles.playersGrid}>
              {participants.map((participant: EventParticipant) => {
                const guestCount = participant.guestCount ?? (participant as any).guest_count ?? 0;
                // If guestCount is stored as total (self + guests), and we want "suffix", 
                // typically backend sends guestCount as the number of extra guests.
                // Looking at MembersModal logic: item.guestsCount? - 1. 
                // Let's stick to the raw guestCount if it represents extra guests.
                // In this app, guestCount usually means "additional guests".
                const hasGuest = guestCount > 0;

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
                    <TextDs
                      size={12}
                      weight="medium"
                      color="primary"
                      style={styles.playerName}
                      numberOfLines={2}
                    >
                      {participant.fullName}
                    </TextDs>
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
            <FlexView style={styles.playersGrid}>
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
                  <TextDs
                    size={14} weight="regular"
                    color="primary"
                    style={styles.playerName}
                    numberOfLines={2}
                  >
                    {waitlistEntry.user.fullName}
                  </TextDs>
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
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  playerItem: {
    width: '18%',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  playerContent: {
    marginRight: 'auto',
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
