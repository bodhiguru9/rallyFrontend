import React from 'react';
import { Image, StyleSheet, Pressable, TouchableOpacity, View } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { EventData } from '@app-types';
import { FlexView, ImageDs, TextDs } from '@components';
import { IconTag } from '@components/global/IconTag';
import { EventStatusBadge } from '@components/global/event-status-badge';
import { Users2 } from 'lucide-react-native';
import { Card } from '@components/global/Card';
import { formatDate, shareEvent } from '@utils';
import { ParticipantProfiles } from '@designSystem/materials';

interface CalendarEventCardProps {
  event: EventData;
  onPress: (id: string) => void;
}

export const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ event, onPress }) => {
  const handlePress = () => {
    onPress(event.id);
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
            <FlexView width={100} aspectRatio={1 / 1}>
              <Image source={{ uri: event.eventImages?.[0] }} style={styles.image} />
              <EventStatusBadge
                variant={event.eventStatus === 'ongoing' ? 'ongoing' : 'going'}
              />
            </FlexView>
            <ParticipantProfiles participants={(event as EventData).participants ?? []} />
          </FlexView>

          {/* Content on Right */}
          <FlexView style={styles.content}>
            <FlexView style={styles.titleSection}>
              <TextDs size={16} weight="bold">{event.eventName}</TextDs>
              {event.creator?.fullName &&
                <TextDs size={12} weight="regular">
                  by {event.creator?.fullName || 'Unknown Organizer'}
                </TextDs>}
            </FlexView>

            {/* Tags */}
            <FlexView flexDirection="row" alignItems="center" gap={spacing.sm}>
              <IconTag title={event.eventSports[0]} variant="orange" />
              <IconTag title={event.eventType} variant="teal" />
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
