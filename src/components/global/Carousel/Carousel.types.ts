import type React from 'react';
import type {
  Animated,
  FlatListProps,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type CarouselAnimatedIndex =
  | Animated.Value
  | Animated.AnimatedDivision<number>
  | Animated.AnimatedInterpolation<number>;

export interface CarouselRenderItemInfo<T> extends ListRenderItemInfo<T> {
  animatedIndex: CarouselAnimatedIndex;
}

export interface CarouselProps<T> {
  data: T[];
  itemWidth: number;
  itemSpacing?: number;
  initialIndex?: number;
  renderItem: (info: CarouselRenderItemInfo<T>) => React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
  onIndexChange?: (index: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  listProps?: Omit<
    FlatListProps<T>,
    | 'data'
    | 'renderItem'
    | 'horizontal'
    | 'scrollEnabled'
    | 'showsHorizontalScrollIndicator'
    | 'keyExtractor'
    | 'contentContainerStyle'
  >;
}
