import React, { useMemo } from 'react';
import { Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';
import { Shield, Calendar, Users } from 'lucide-react-native';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import type { CarouselAnimatedIndex } from '@components/global/Carousel';
import { ImageDs } from '@components';
import { IconTag } from '@components/global/IconTag';
import { CommunityData } from '../components/PickedForYouSection/PickedForYouSection';

interface FeaturedOrganiserCardProps {
  organiser: CommunityData;
  onPress: () => void;
  width: number;
  index: number;
  animatedIndex: CarouselAnimatedIndex;
  isActive?: boolean;
  hostedCount?: number;
  attendeesCount?: number;
}

export const FeaturedOrganiserCard: React.FC<FeaturedOrganiserCardProps> = ({
  organiser,
  onPress,
  width,
  index,
  animatedIndex,
  isActive = false,
  hostedCount,
  attendeesCount,
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
        onPress={onPress}
        style={styles.cardTouchable}
        activeOpacity={0.9}
      >
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
        <ImageDs image="sportsBg" style={styles.image} />
        <FlexView
          flexDirection="column"
          justifyContent="space-between"
          width="100%"
          height="100%"
          position="relative"
          padding={spacing.md}
          zIndex={2}
        >
          <FlexView flexDirection="row" gap={spacing.xs}>
            {hostedCount !== undefined && (
              <IconTag
                title={`${hostedCount} Hosted`}
                icon={'calendarHosted'}
                variant="purple"
                size="small"
              />
            )}
            {attendeesCount !== undefined && (
              <IconTag
                title={`${attendeesCount} Attendees`}
                icon={'multipleUser'}
                variant="yellow"
                size="small"
              />
            )}
          </FlexView>

          <FlexView gap={spacing.sm}>
            <FlexView gap={spacing.xs}>
              <TextDs size={14} weight="regular" color="white">
                {organiser.communityName || 'Community'}
              </TextDs>
              <TextDs size={14} weight="regular" color="light">
                By {organiser.fullName}
              </TextDs>
            </FlexView>
            <FlexView flexDirection='row' gap={spacing.sm}>
              {organiser.sports.map((sport, idx) => (
                <IconTag key={idx} title={sport} />
              ))}
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
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
});
