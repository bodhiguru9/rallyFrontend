import React, { useState, useEffect, useMemo } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { Users } from 'lucide-react-native';
import { colors, spacing, borderRadius, avatarSize } from '@theme';
import { shareEvent } from '@utils/share-utils';
import { FlexView } from '@designSystem/atoms/FlexView';
import { ImageDs } from '@designSystem/atoms/image';
import { TextDs } from '@designSystem/atoms/TextDs';
import { IconTag } from '@components/global/IconTag';
import { EventStatusBadge } from '@components/global/event-status-badge';
import { formatDate, calculateSpotsFilled } from '@utils';
import type { EventCardProps } from './EventCard.types';
import { Card } from '../Card';
import { Title } from '../Title';
import { Subtitle } from '../Subtitle';
import { ParticipantProfiles } from '@designSystem/materials';
import { MembersModal } from '@screens/event-details/MembersModal';
import type { EventStatusBadgeVariant } from '@components/global/event-status-badge/EventStatusBadge.types';
import type { EventData, EventParticipant } from '@app-types';
import type { PlayerBooking } from '@services/booking-service';
import { resolveImageUri } from '@utils/image-utils';
import { useEvent } from '@hooks/use-events';
import { useAuthStore } from '@store/auth-store';
import { images } from '@assets/images';
import { logger } from '@dev-tools/logger';
function getStatusBadgeVariant(event: EventData | PlayerBooking): EventStatusBadgeVariant {
  const booking = 'booking' in event ? event.booking : undefined;
  const now = new Date();
  const eventDateTime = event.eventDateTime ? new Date(event.eventDateTime) : null;
  const isPastEvent = eventDateTime ? eventDateTime < now : false;

  // 1. Cancelled (booking-level or event-level)
  if (booking?.bookingStatus === 'cancelled' || event.eventStatus === 'cancelled') {
    return 'cancelled';
  }

  // 2. Request Rejected
  const approvalStatus = event.approvalStatus;
  const isRejected = (event as any).isRejected;
  if (approvalStatus === 'rejected' || isRejected === true) {
    return 'request-rejected';
  }

  // 3. Payment pending (if applicable)
  const paymentStatus =
    'payment' in event && event.payment && 'paymentStatus' in event.payment
      ? String((event.payment as { paymentStatus: string }).paymentStatus).toLowerCase()
      : '';
  if (paymentStatus.includes('pending')) {
    return 'payment-pending';
  }

  // 4. Pending approval
  if (('isPending' in event && (event as any).isPending) || approvalStatus === 'pending') {
    return 'pending-approval';
  }

  // 5. Ongoing
  if (event.eventStatus === 'ongoing' || booking?.isOngoing) {
    return 'ongoing';
  }

  // 6. Registration window checks
  const regEnd = event.eventRegistrationEndTime;
  if (regEnd) {
    try {
      if (now > new Date(regEnd)) {
        return 'registration-ended';
      }
    } catch { /* ignore parse errors */ }
  }

  // If it's a past event and we haven't returned a specific status, it's ended
  if (isPastEvent || booking?.isPast) {
    return 'registration-ended';
  }

  const regStart = event.eventRegistrationStartTime;
  if (regStart) {
    try {
      if (now < new Date(regStart)) {
        return 'registration-soon';
      }
    } catch { /* ignore parse errors */ }
  }

  // 7. Default
  return 'going';
}

// Removed hardcoded EVENT_FALLBACK_IMAGE

export const EventCard: React.FC<EventCardProps> = ({
  id,
  event,
  onPress,
  onBookmark: _onBookmark,
  hidePrice = false,
  hideCreator = false,
  showStatus = false,
  spotsStatusLabel,
  showRevenue = false,
  displayTimeZone,
}) => {
  const user = useAuthStore((state) => state.user);
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState<any>(null);

  const isPlayerBooking = 'booking' in event;
  const hasParticipants = (event as EventData).participants && (event as EventData).participants!.length > 0;

  const { data: fullEvent } = useEvent(id, {
    enabled: isMembersModalVisible && (!hasParticipants || (event as EventData).eventMaxGuest == null),
    forPlayer: true,
    allowPrivate: true,
  });

  const displayEvent = (fullEvent || event) as EventData | PlayerBooking;
  const eventToDisplay = displayEvent as EventData; // Cast for easier access to participants/spotsInfo

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
  const formattedDateTime = formatDate(displayEvent.eventDateTime, 'display-range', {
    timeZone: displayTimeZone,
  });

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
    social: 'socialColor',
    tournament: 'tournamentColor',
    training: 'trainingColor',
    class: 'classColor',
    competitive: 'tournamentColor',
    'competitive-social': 'socialColor',
    'tournament-competitive': 'tournamentColor',
    private: 'privateIcon',
  };

  const sportKey = (event.eventSports?.[0] ?? '').toString().toLowerCase().replace(/\s+/g, '');
  const isPrivate = (event as any).IsPrivateEvent === true || String(event.eventType).toLowerCase() === 'private';
  const eventTypeKey = isPrivate ? 'private' : String(event.eventType ?? '').toLowerCase().replace(/\s+/g, '');

  const EventTypeIcon = (eventTypeIconMap[eventTypeKey] ?? 'socialColor') as any;
  // Get event image: eventImages, gameImages, eventImage (singular), then organizer profile
  const isOrganiserUser = user?.userType === 'organiser';

  const rawEventImage =
    event.eventImages?.[0] ??
    (event as EventData).gameImages?.[0] ??
    (event as any).eventImage;

  // Find organiser in participants if creator is missing (common in lists)
  const creatorFromParticipants = useMemo(() => {
    if (event.creator) return null;
    const participants = (event as any).participants as EventParticipant[] | undefined;
    return participants?.find((p: EventParticipant) =>
      p.userType === 'organiser' ||
      (p as any).isOrganiser ||
      p.userId === (event as any).organiserId
    );
  }, [event, event.creator]);

  const organizerProfilePic = useMemo(() => {
    // 1. If current user is organiser, use THEIR profile pic (user request)
    if (isOrganiserUser && user?.profilePic) {
      return user.profilePic;
    }

    // 2. Otherwise use event creator/organiser pic
    return (
      (event as EventData).eventCreatorProfilePic ||
      event.creator?.profilePic ||
      creatorFromParticipants?.profilePic ||
      (event as any).organiser_profile_pic ||
      (event as any).creator_pic ||
      (event as any).organizerProfilePic
    );
  }, [isOrganiserUser, user?.profilePic, event, creatorFromParticipants]);

  const eventImageUri = resolveImageUri(rawEventImage);
  const organizerImageUri = resolveImageUri(organizerProfilePic);

  // Cascading fallback logic: Event Image -> Organiser Profile Pic -> Rally Logo
  useEffect(() => {
    console.log('🖼️ [EventCard] DEBUG DATA', {
      id,
      eventName: event.eventName,
      isOrganiserUser,
      userProfilePic: user?.profilePic,
      hasEventImages: !!event.eventImages?.length,
      rawEventImage,
      organizerProfilePic,
      eventImageUri,
      organizerImageUri,
      hasCreator: !!event.creator,
      hasParticipants: !!(event as any).participants?.length,
      foundCreatorInParts: !!creatorFromParticipants,
    });

    if (eventImageUri) {
      setImageSource({ uri: eventImageUri });
    } else if (organizerImageUri) {
      setImageSource({ uri: organizerImageUri });
    } else {
      setImageSource(images.blackLogo);
    }
  }, [id, eventImageUri, organizerImageUri]);

  const handleImageError = () => {
    const currentUri = (imageSource as any)?.uri;
    logger.warn('❌ [EventCard] Image load failed', {
      eventId: id,
      eventName: event.eventName,
      failedUri: currentUri,
      isEventImage: currentUri === eventImageUri,
      isOrganizerImage: currentUri === organizerImageUri,
    });

    // If event image failed, try organiser pic
    if (currentUri === eventImageUri) {
      if (organizerImageUri && organizerImageUri !== eventImageUri) {
        setImageSource({ uri: organizerImageUri });
      } else {
        setImageSource(images.blackLogo);
      }
    }
    // If organiser pic failed (or was already being used), fallback to Rally logo
    else if (currentUri === organizerImageUri) {
      setImageSource(images.blackLogo);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <Card style={{ width: '100%' }}>
        <FlexView flexDirection="row" width="100%" gap={spacing.sm}>
          {/* Left Section - Event Image */}
          <FlexView style={styles.imageContainer}>
            <Image
              source={imageSource || images.blackLogo}
              style={styles.image}
              resizeMode="cover"
              onError={handleImageError}
            />
            {showStatus && (
              <EventStatusBadge variant={getStatusBadgeVariant(event)} />
            )}
          </FlexView>

          {/* Right Section - Event Details */}
          <FlexView flex={1}>
            {/* Header with Title, Organizer, and Share Button */}
            <FlexView flexDirection="row" justifyContent="space-between" alignItems="flex-start">
              <FlexView flex={1} gap={spacing.xs}>
                <Title variant="cardTitle" numberOfLines={1}>{displayEvent.eventName}</Title>
                {!hideCreator && (eventToDisplay.eventCreatorName || displayEvent.creator?.fullName) &&
                  <Subtitle variant="small">
                    by {eventToDisplay.eventCreatorName || displayEvent.creator?.fullName}
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
            <FlexView flexDirection="row" gap={spacing.sm} flexWrap="wrap">
              {displayEvent.eventSports?.[0] && (
                <IconTag
                  title={displayEvent.eventSports[0]}
                  variant="orange"
                  searchType="sport"
                  size="small"
                />
              )}
              {(displayEvent.eventType || isPrivate) && (
                <IconTag
                  title={isPrivate ? 'Private' : displayEvent.eventType}
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
                {displayEvent.eventLocation || 'Location TBD'}
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
              participants={eventToDisplay.participants ?? []}
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

                const isPastEvent = new Date(event.eventDateTime) < new Date();

                if (spotsFull && !isPastEvent) {
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
              <ImageDs image="dhiramIcon" size={14} />
              <TextDs size={18} weight="semibold" color="blueGray">
                {showRevenue
                  ? (() => {
                    const spotsBooked = (event as EventData).spotsInfo?.spotsBooked ?? (event as PlayerBooking).eventTotalAttendNumber ?? 0;
                    const pricePerGuest = typeof event.eventPricePerGuest === 'number' ? event.eventPricePerGuest : parseFloat(String(event.eventPricePerGuest ?? 0)) || 0;
                    return Math.round(spotsBooked * pricePerGuest);
                  })()
                  : event.eventPricePerGuest}
              </TextDs>
            </FlexView>
          )}
        </FlexView>
      </Card>

      {/* Members Modal – shown when user taps "View All" on participant avatars */}
      <MembersModal
        visible={isMembersModalVisible}
        eventTitle={displayEvent.eventName ?? 'Event'}
        organizerName={
          eventToDisplay.creator?.fullName ||
          eventToDisplay.eventCreatorName ||
          'Unknown Organizer'
        }
        participants={(() => {
          const bookedGuests =
            (eventToDisplay as any).eventTotalAttendNumber ??
            (eventToDisplay as any).booking?.guestsCount ??
            (eventToDisplay as any).booking?.guests ??
            (eventToDisplay as any).guestsCount ??
            (eventToDisplay as any).guests ??
            1;


          return (
            eventToDisplay.participants?.map((p) => ({
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
        spotsFilled={calculateSpotsFilled(eventToDisplay)}
        totalSpots={
          eventToDisplay.spotsInfo?.totalSpots ??
          (displayEvent as PlayerBooking).eventMaxGuest ??
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
