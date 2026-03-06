import React, { useCallback, useMemo, useRef } from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import {
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  type ListRenderItemInfo,
} from 'react-native';
import type { CarouselProps } from './Carousel.types';

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};

export const Carousel = <T,>({
  data,
  itemWidth,
  itemSpacing = 0,
  initialIndex,
  renderItem,
  keyExtractor,
  onIndexChange,
  containerStyle,
  contentContainerStyle,
  listProps,
}: CarouselProps<T>) => {
  const listRef = useRef<FlatList<T>>(null);
  const scrollX = useMemo(() => new Animated.Value(0), []);
  const lastReportedIndexRef = useRef(0);

  const snapInterval = itemWidth + itemSpacing;
  const maxIndex = Math.max(data.length - 1, 0);
  const resolvedInitialIndex = useMemo(() => {
    if (typeof initialIndex === 'number') {
      return clamp(initialIndex, 0, maxIndex);
    }
    return Math.floor(maxIndex / 2);
  }, [initialIndex, maxIndex]);

  const animatedIndex = useMemo(() => {
    return Animated.divide(scrollX, snapInterval);
  }, [scrollX, snapInterval]);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = clamp(Math.round(x / snapInterval), 0, maxIndex);
      if (index !== lastReportedIndexRef.current) {
        lastReportedIndexRef.current = index;
        onIndexChange?.(index);
      }
    },
    [maxIndex, onIndexChange, snapInterval],
  );

  React.useEffect(() => {
    if (data.length === 0) {
      return;
    }
    scrollX.setValue(resolvedInitialIndex * snapInterval);
    lastReportedIndexRef.current = resolvedInitialIndex;
    onIndexChange?.(resolvedInitialIndex);
  }, [data.length, resolvedInitialIndex, snapInterval, scrollX, onIndexChange]);

  const renderCarouselItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      return renderItem({
        ...info,
        animatedIndex,
      });
    },
    [animatedIndex, renderItem],
  );

  return (
    <FlexView style={[styles.container, containerStyle]}>
      <FlatList
        ref={listRef}
        data={data}
        horizontal
        scrollEnabled={data.length > 1}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExtractor ?? ((_, index) => index.toString())}
        renderItem={renderCarouselItem}
        contentContainerStyle={contentContainerStyle}
        ItemSeparatorComponent={
          itemSpacing > 0 ? () => <FlexView style={{ width: itemSpacing }} /> : undefined
        }
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate={0}
        initialScrollIndex={Math.min(resolvedInitialIndex, Math.max(0, data.length - 1))}
        initialNumToRender={Math.max(resolvedInitialIndex + 2, 5)}
        removeClippedSubviews
        {...listProps}
      />
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
