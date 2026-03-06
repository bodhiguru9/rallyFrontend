import type { Animated, StyleProp, ViewStyle } from 'react-native';
import type { CarouselAnimatedIndex } from './Carousel.types';

export interface CarouselItemProps {
  title: string;
  subtitle?: string;
  width: number;
  index: number;
  animatedIndex: CarouselAnimatedIndex;
  containerStyle?: StyleProp<ViewStyle>;
  getAnimatedStyle?: (
    relativeIndex: Animated.AnimatedInterpolation<number>,
  ) => Animated.WithAnimatedObject<ViewStyle>;
}
