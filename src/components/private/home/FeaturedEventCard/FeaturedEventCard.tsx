import React, { useMemo } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, avatarSize, getFontStyle } from '@theme';
import type { FeaturedEventCardProps } from './FeaturedEventCard.types';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { IconTag } from '@components/global/IconTag';
import { formatDate } from '@utils';
import { ImageDs } from '@designSystem/atoms/image';
import { resolveImageUri } from '@utils/image-utils';

export const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({
  id,
  onPress,
  event,
  width,
  index,
  animatedIndex,
  isActive = false,
}) => {
  const relativeIndex = useMemo(() => {
    // Relative index ensures animation follows scroll position, not state updates.
    return Animated.subtract(animatedIndex, index) as Animated.AnimatedInterpolation<number>;
  }, [animatedIndex, index]);

  const animatedStyle = useMemo(() => {
    const scale = relativeIndex.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });
    const opacity = relativeIndex.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp',
    });
    return {
      transform: [{ scale }],
      opacity,
    };
  }, [relativeIndex]);

  const displayImage = useMemo(() => {
    const rawImage = event.eventImages?.[0] || (event as any).gameImages?.[0] || (event as any).eventImage;
    const organizerImage = event.creator?.profilePic || (event as any).eventCreatorProfilePic;
    
    return resolveImageUri(rawImage) || resolveImageUri(organizerImage) || 'https://via.placeholder.com/400?text=Event';
  }, [event]);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { width },
        isActive ? styles.cardActive : styles.cardInactive,
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(id)}
        style={styles.cardTouchable}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: displayImage }}
          style={[styles.image, styles.imageBackground]}
          resizeMode="cover"
        />
        <FlexView
          position="absolute"
          top={0}
          left={0}
          width={'100%'}
          height={'100%'}
          zIndex={1}
          style={{
            experimental_backgroundImage:
              'linear-gradient(0deg,rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)',
          }}
        ></FlexView>
        <FlexView
          flexDirection="column"
          justifyContent="space-between"
          width="100%"
          height="100%"
          position="relative"
          padding={spacing.md}
          zIndex={2}
        >
          {/* Dynamically rendered IconTags */}
          <FlexView flexDirection="row" gap={spacing.md}>
            {event.eventSports?.[0] && (
              <IconTag title={event.eventSports[0]} variant="orange" />
            )}
            {event.eventType && (
              <IconTag title={event.eventType} variant="teal" />
            )}
          </FlexView>

          <FlexView gap={spacing.sm}>
            <TextDs size={16} weight="semibold" color="white">
              {event.eventName}
            </TextDs>
            <TextDs size={14} weight="regular" color="off-white">
              by {event.creator?.fullName || event.eventCreatorName || 'Unknown Organizer'}
            </TextDs>
            <FlexView
              height={30}
              width={'100%'}
              backgroundColor={colors.primaryDark}
              borderRadius={borderRadius.full}
              alignItems="center"
              justifyContent="center"
              gap={spacing.md}
              flexDirection="row"
              style={{ boxShadow: colors.glass.boxShadow.light }}
            >
              <ImageDs image="time" size={17} />
              <TextDs size={14} weight="regular" color="white">
                {formatDate(event.eventDateTime, 'display-range')}
              </TextDs>
            </FlexView>
          </FlexView>
        </FlexView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    aspectRatio: 4 / 5,
    marginBottom: spacing.base,
  },
  cardActive: {
    zIndex: 2,
    elevation: 2,
  },
  cardInactive: {
    zIndex: 1,
    elevation: 1,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    boxShadow: colors.boxShadow.midRaised,
  },
  card: {
    width: 250,
    aspectRatio: 4 / 5,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.base,
    boxShadow: colors.boxShadow.midRaised,
  },
  imageContainer: {
    position: 'relative',
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.sm,
  },
  categoriesContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    ...getFontStyle(8, 'medium'),
  },
  content: {
    padding: spacing.base,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  organizer: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: avatarSize.sm,
    height: avatarSize.sm,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  spotsText: {
    ...getFontStyle(8, 'medium'),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  price: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
});