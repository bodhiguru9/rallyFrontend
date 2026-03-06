import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { Users } from 'lucide-react-native';
import { colors, spacing, borderRadius, avatarSize } from '@theme';
import { shareEvent } from '@utils/share-utils';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';
import { IconTag } from '@components/global/IconTag';
import { EventStatusBadge } from '@components/global/event-status-badge';
import { formatDate } from '@utils';
import type { EventCardProps } from './EventCard.types';
import { Card } from '../Card';
import { Title } from '../Title';
import { Subtitle } from '../Subtitle';
import { ParticipantProfiles } from '@designSystem/materials';
import { MembersModal } from '@screens/event-details/MembersModal';
import type { EventStatusBadgeVariant } from '@components/global/event-status-badge/EventStatusBadge.types';
import type { EventData } from '@app-types';
import type { PlayerBooking } from '@services/booking-service';

function getStatusBadgeVariant(event: EventData | PlayerBooking): EventStatusBadgeVariant {
  const paymentStatus =
    'payment' in event && event.payment && 'paymentStatus' in event.payment
      ? String((event.payment as { paymentStatus: string }).paymentStatus).toLowerCase()
      : '';
  if (paymentStatus.includes('pending')) {
    return 'payment-pending';
  }
  if (event.eventStatus === 'ongoing') {
    return 'ongoing';
  }
  return 'going';
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  event,
  onPress,
  onBookmark: _onBookmark,
  hidePrice = false,
  hideCreator = false,
  showStatus = false,
  spotsStatusLabel,
}) => {
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);

  const handlePress = () => {
    onPress(id);
  };

  const handleOpenMembersModal = () => {
    setIsMembersModalVisible(true);
  };

  const handleCloseMembersModal = () => {
    setIsMembersModalVisible(false);
  };

  // Format date for display: "Sat 24 Oct, 1:00 - 2:00 PM"
  const formattedDateTime = formatDate(event.eventDateTime, 'display-range');

  const handleShare = () => {
    // Calculate spots info
    const eventData = event as EventData;
    const playerBooking = event as PlayerBooking;
    const spotsFilled = eventData.spotsInfo?.spotsBooked ??
      playerBooking.eventTotalAttendNumber ??
      0;
    const totalSpots = eventData.spotsInfo?.totalSpots ??
      playerBooking.eventMaxGuest ??
      0;
    const spotsLeft = eventData.spotsInfo?.spotsLeft ??
      eventData.availableSpots ??
      (playerBooking.eventMaxGuest - playerBooking.eventTotalAttendNumber);

    shareEvent({
      eventId: id,
      eventName: event.eventName ?? 'Event',
      creatorName: (event as EventData).eventCreatorName ?? event.creator?.fullName ?? '',
      formattedDateTime,
      eventLocation: event.eventLocation ?? undefined,
      sportType: event.eventSports?.[0] ?? undefined,
      price: event.eventPricePerGuest ?? undefined,
      spotsFilled,
      totalSpots,
      spotsLeft: spotsLeft > 0 ? spotsLeft : undefined,
    });
  };

  // const sportIconMap: Record<string, string> = {
  //   football: 'footballIcon',
  //   basketball: 'basketballYellow',
  //   tennis: 'tennisYellow',
  //   padel: 'padelYellow',
  //   cricket: 'cricketYellow',
  //   badminton: 'badmintonYellow',
  //   volleyball: 'volleyballYellow',
  //   pickleball: 'pickleballYellow',
  //   pilates: 'pilatesYellow',
  //   'table tennis': 'tableTennisYellow',
  // };

  const eventTypeIconMap: Record<string, string> = {
    social: 'socialIcon',
    tournament: 'tournamentIcon',
    training: 'trainingIcon',
    class: 'classIcon',
    group: 'socialIcon',
  };

  const sportKey = event.eventSports?.[0]?.toLowerCase() ?? '';
  const eventTypeKey = String(event.eventType ?? '').toLowerCase();

  // const SportIcon = (sportIconMap[sportKey] ?? 'footballIcon') as any;
  const EventTypeIcon = (eventTypeIconMap[eventTypeKey] ?? 'socialIcon') as any;
  // Get event image or fallback to organizer profile photo
  const eventImage = event.eventImages?.[0];
  const organizerProfilePic = (event as EventData).eventCreatorProfilePic || event.creator?.profilePic;
  const displayImage = eventImage || organizerProfilePic || undefined;

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <Card style={{ width: '100%' }}>
        <FlexView flexDirection="row" width="100%" gap={spacing.sm}>
          {/* Left Section - Event Image */}
          <FlexView style={styles.imageContainer}>
            <Image source={{ uri: displayImage }} style={styles.image} resizeMode="cover" />
            {showStatus && (
              <EventStatusBadge variant={getStatusBadgeVariant(event)} />
            )}
          </FlexView>

          {/* Right Section - Event Details */}
          <FlexView flex={1}>
            {/* Header with Title, Organizer, and Share Button */}
            <FlexView flexDirection="row" justifyContent="space-between" alignItems="flex-start">
              <FlexView flex={1} gap={spacing.xs}>
                <Title variant="cardTitle" numberOfLines={1}>{event.eventName}</Title>
                {!hideCreator && ((event as EventData).eventCreatorName || event.creator?.fullName) &&
                  <Subtitle variant="small">
                    by {(event as EventData).eventCreatorName || event.creator?.fullName}
                  </Subtitle>}
              </FlexView>

              {/* Paperplane Icon (Share) – wrapped so card onPress does not fire */}
              <View onStartShouldSetResponder={() => true}>
                <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
                  <ImageDs image="PaperPlane" style={styles.paperPlaneIcon} />
                </TouchableOpacity>
              </View>
            </FlexView>

            {/* Tags */}
            <FlexView flexDirection="row" gap={spacing.sm} marginTop={spacing.sm} flexWrap="wrap">
              {event.eventSports?.[0] && (
                <IconTag
                  title={event.eventSports[0]}
                  // Notice we completely removed the icon={SportIcon} line
                  variant="orange"
                  searchType="sport"
                  size="small"
                />
              )}
              {event.eventType && (
                <IconTag
                  title={event.eventType}
                  icon={EventTypeIcon}
                  searchType="eventType"
                  size="small"
                />
              )}
            </FlexView>

            {/* Date and Time */}
            <FlexView
              flexDirection="row"
              alignItems="center"
              flex={1}
              gap={spacing.xs}
              marginTop={spacing.sm}
            >
              <ImageDs image="time" size={18} />
              <TextDs size={12} weight="regular" numberOfLines={1} style={styles.infoText}>
                {formattedDateTime}
              </TextDs>
            </FlexView>

            {/* Location */}
            <FlexView
              flexDirection="row"
              alignItems="center"
              flex={1}
              gap={spacing.xs}
              marginTop={spacing.xs}
            >
              <ImageDs image="locationPin" size={18} />
              <TextDs
                size={12}
                weight="regular"
                numberOfLines={1}
                style={styles.infoText}
              >
                {event.eventLocation || 'Location TBD'}
              </TextDs>
            </FlexView>
          </FlexView>
        </FlexView>
        <FlexView
          flexDirection="row"
          gap={spacing.base}
          alignItems="center"
          justifyContent="space-between"
          width={'100%'}
        >
          <FlexView flexDirection="row" mt={spacing.sm} gap={spacing.base} alignItems="center">
            <ParticipantProfiles
              participants={(event as EventData).participants ?? []}
              onViewAllPress={handleOpenMembersModal}
            />
            {/* spots info */}
            {spotsStatusLabel ? (
              <TextDs size={12} weight="regular" color="success">
                {spotsStatusLabel}
              </TextDs>
            ) : (
              (() => {
                const eventData = event as EventData;
                const playerBooking = event as PlayerBooking;
                const spotsFull = eventData.spotsInfo?.spotsFull ??
                  ((playerBooking.eventTotalAttendNumber ?? 0) >= (playerBooking.eventMaxGuest ?? 0));
                const spotsLeft = eventData.spotsInfo?.spotsLeft ??
                  eventData.availableSpots ??
                  ((playerBooking.eventMaxGuest ?? 0) - (playerBooking.eventTotalAttendNumber ?? 0));
                if (spotsFull) {
                  return (
                    <TextDs size={12} weight="regular" color="error">
                      Waitlist Open
                    </TextDs>
                  );
                }
                const label =
                  spotsLeft >= 10 ? 'Spots Available' : `🔥${Math.max(0, spotsLeft)} spots left`;
                return (
                  <TextDs size={12} weight="regular" color="success">
                    {label}
                  </TextDs>
                );
              })()
            )}
          </FlexView>
          {!hidePrice && (
            <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
              <ImageDs image="DhiramIcon" size={14} />
              <TextDs size={18} weight="semibold" color="blueGray">
                {event.eventPricePerGuest}
              </TextDs>
            </FlexView>
          )}
        </FlexView>
      </Card>

      {/* Members Modal – shown when user taps "View All" on participant avatars */}
      <MembersModal
        visible={isMembersModalVisible}
        eventTitle={event.eventName ?? 'Event'}
        organizerName={
          (event as EventData).creator?.fullName ||
          (event as EventData).eventCreatorName ||
          (event as PlayerBooking).creator?.fullName ||
          'Unknown Organizer'
        }
        participants={
          (event as EventData).participants?.map((p) => ({
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
          })) ?? []
        }
        spotsFilled={
          (event as EventData).spotsInfo?.spotsBooked ??
          (event as PlayerBooking).eventTotalAttendNumber ??
          0
        }
        totalSpots={
          (event as EventData).spotsInfo?.totalSpots ??
          (event as PlayerBooking).eventMaxGuest ??
          0
        }
        onClose={handleCloseMembersModal}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    aspectRatio: 1 / 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    objectFit: 'cover',
  },
  content: {
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: spacing.xs / 2,
  },
  organizer: {
    marginBottom: spacing.xs,
  },
  shareButton: {
    padding: spacing.xxs,
    marginRight: spacing.xs,
  },
  paperPlaneIcon: {
    width: 20,
    height: 20,
  },
  infoText: {
    flex: 1,
  },
  avatarContainer: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.white,
    overflow: 'hidden',
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
  },
  viewAllContainer: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.secondary,
    borderWidth: 2,
    borderColor: colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxs,
  },
  viewAllText: {
    textAlign: 'center',
    lineHeight: 10,
  },
  spotsText: {
    marginLeft: spacing.xs,
  },
  price: {
    marginLeft: spacing.sm,
  },
});
