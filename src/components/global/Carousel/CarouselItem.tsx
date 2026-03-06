import React, { useMemo } from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextDs } from '@designSystem/atoms/TextDs';
import { Animated, StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import type { CarouselItemProps } from './CarouselItem.types';

const defaultAnimatedStyle = (
  relativeIndex: Animated.AnimatedInterpolation<number>,
) => {
  // Use small transforms so each item signals depth without overpowering content.
  const scale = relativeIndex.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.94, 1, 0.94],
    extrapolate: 'clamp',
  });
  const opacity = relativeIndex.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });
  const translateY = relativeIndex.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [8, 0, 8],
    extrapolate: 'clamp',
  });

  return {
    transform: [{ scale }, { translateY }],
    opacity,
  };
};

export const CarouselItem: React.FC<CarouselItemProps> = ({
  title,
  subtitle,
  width,
  index,
  animatedIndex,
  containerStyle,
  getAnimatedStyle,
}) => {
  const relativeIndex = useMemo(() => {
    // Relative index drives visuals: 0 is active, -1 is previous, 1 is next.
    return Animated.subtract(animatedIndex, index) as Animated.AnimatedInterpolation<number>;
  }, [animatedIndex, index]);

  const animatedStyle = useMemo(() => {
    return getAnimatedStyle ? getAnimatedStyle(relativeIndex) : defaultAnimatedStyle(relativeIndex);
  }, [getAnimatedStyle, relativeIndex]);

  return (
    <Animated.View style={[styles.container, { width }, animatedStyle, containerStyle]}>
      <FlexView style={styles.card}>
        <TextDs style={styles.title}>{title}</TextDs>
        {subtitle ? <TextDs style={styles.subtitle}>{subtitle}</TextDs> : null}
      </FlexView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  card: {
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: colors.border.white,
    padding: spacing.base,
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    ...getFontStyle(16, 'semibold'),
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.text.secondary,
    ...getFontStyle(12, 'regular'),
  },
});
