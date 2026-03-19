import React from 'react';
import { Image, StyleSheet, Pressable, TouchableOpacity, View } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { EventData } from '@app-types';
import { FlexView, ImageDs, TextDs } from '@components';
import { IconTag } from '@components/global/IconTag';
import { EventStatusBadge } from '@components/global/event-status-badge';
import { Card } from '@components/global/Card';
import { formatDate, shareEvent, calculateSpotsFilled } from '@utils';
import { ParticipantProfiles } from '@designSystem/materials';
import { MembersModal } from '@screens/event-details/MembersModal/MembersModal';
import { useAuthStore } from '@store/auth-store';
import { useEvent } from '@hooks/use-events';

interface CalendarEventCardProps {
  event: EventData;
  onPress: (id: string) => void;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ event, onPress }) => {
  const { user } = useAuthStore();
  const [isMembersModalVisible, setIsMembersModalVisible] = React.useState(false);

  // Fetch full event details if participants are missing (same as EventCard.tsx)
  const hasParticipants = event.participants && event.participants.length > 0;
  const { data: fullEvent, isLoading: isFetchingEvent } = useEvent(event.eventId, {
    enabled: isMembersModalVisible && !hasParticipants,
    forPlayer: true,
    allowPrivate: true,
  });

  const displayEvent = fullEvent || event;

  const handlePress = () => {
    onPress(event.id);
  };

  const handleOpenMembersModal = () => {
    setIsMembersModalVisible(true);
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalVisible(false);
  };

  const formattedDateTime = formatDate(event.eventDateTime, 'display-range');
  const handleShare = () => {
    shareEvent({
      eventId: event.id,
      eventName: event.eventName ?? 'Event',
      creatorName: event.creator?.fullName ?? '',
      formattedDateTime,
      eventLocation: event.eventLocation ?? undefined,
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <Card>
        <FlexView flexDirection="row">
          {/* Image on Left */}
          <FlexView>
            <FlexView marginBottom={15} width={100} aspectRatio={1 / 1}>
              <Image source={{ uri: event.eventImages?.[0] }} style={styles.image} />
              <EventStatusBadge
                variant={event.eventStatus === 'ongoing' ? 'ongoing' : 'going'}
              />
            </FlexView>
            <ParticipantProfiles
              participants={displayEvent.participants ?? []}
              onViewAllPress={handleOpenMembersModal}
            />
          </FlexView>

          {/* Content on Right */}
          <FlexView style={styles.content}>
            <FlexView style={styles.titleSection}>
              <TextDs size={16} weight="bold">{displayEvent.eventName}</TextDs>
              {displayEvent.creator?.fullName &&
                <TextDs size={12} weight="regular">
                  by {(displayEvent.creator as any)?.communityName || (displayEvent as any).communityName || displayEvent.creator?.fullName || 'Unknown Organizer'}
                </TextDs>}
            </FlexView>

            {/* Tags */}
            <FlexView flexDirection="row" alignItems="center" gap={spacing.sm}>
              <IconTag title={displayEvent.eventSports?.[0]} variant="orange" />
              <IconTag title={displayEvent.eventType} variant="teal" />
            </FlexView>

            <View style={styles.shareButtonWrap} onStartShouldSetResponder={() => true}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <ImageDs image="PaperPlane" size={24} />
              </TouchableOpacity>
            </View>

            {/* Date and Time */}
            <FlexView flexDirection="row" gap={spacing.sm} alignItems="center" style={styles.infoRow}>
              <ImageDs image="time" size={16} />
              <TextDs style={styles.infoText}>{formatDate(event.eventDateTime, 'display-range')}</TextDs>
            </FlexView>
            <FlexView flexDirection="row" gap={spacing.sm} alignItems="center" style={styles.infoRow}>
              <ImageDs image="locationPin" size={16} />
              <TextDs style={styles.infoText}>{event.eventLocation}</TextDs>
            </FlexView>
          </FlexView>
        </FlexView>
      </Card>

      <MembersModal
        visible={isMembersModalVisible}
        eventTitle={displayEvent.eventName ?? 'Event'}
        organizerName={
          displayEvent.creator?.fullName ||
          (displayEvent as any).eventCreatorName ||
          'Unknown Organizer'
        }
        participants={(() => {
          const bookedGuests =
            (displayEvent as any).eventTotalAttendNumber ??
            (displayEvent as any).booking?.guestsCount ??
            (displayEvent as any).booking?.guests ??
            (displayEvent as any).guestsCount ??
            (displayEvent as any).guests ??
            1;

          return (
            displayEvent.participants?.map((p) => ({
              userId: p.userId,
              userType: p.userType || 'player',
              email: p.email || '',
              mobileNumber: p.mobileNumber || '',
              profilePic: p.profilePic,
              fullName: p.fullName,
              dob: p.dob,
              gender: p.gender,
              sport1: p.sport1,
              sport2: p.sport2,
              joinedAt: p.joinedAt,
              guestsCount: p.userId === user?.userId ? Math.max(0, bookedGuests - 1) : undefined,
            })) ?? []
          );
        })()}
        spotsFilled={calculateSpotsFilled(displayEvent)}
        totalSpots={
          displayEvent.spotsInfo?.totalSpots ??
          (displayEvent as any).eventMaxGuest ??
          0
        }
        onClose={handleCloseMembersModal}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.base,
    flexDirection: 'row',
    minHeight: 120,
  },
  imageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.secondary,
    objectFit: 'cover',
    borderRadius: borderRadius.lg,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  titleSection: {
    marginBottom: spacing.xs,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: 2,
  },
  organizer: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...getFontStyle(8, 'medium'),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    // marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  infoText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  statusText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error, // Red for "Fully Booked"
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  participantsText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.secondary,
  },
  shareButtonWrap: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  shareButton: {
    padding: spacing.xs,
  },
});
