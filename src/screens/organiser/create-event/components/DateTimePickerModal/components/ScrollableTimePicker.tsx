import React, { useRef, useEffect } from 'react';
import { TextDs,  FlexView } from '@components';
import {FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface ScrollableTimePickerProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  style?: object;
}

export const ScrollableTimePicker: React.FC<ScrollableTimePickerProps> = ({
  value,
  options,
  onChange,
  formatValue = (val) => String(val).padStart(2, '0'),
  style,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const itemHeight = 50;
  const visibleItems = 3;

  useEffect(() => {
    const index = options.indexOf(value);
    if (index !== -1 && flatListRef.current) {
      // Use a longer timeout to ensure the FlatList is fully rendered
      const timeoutId = setTimeout(() => {
        try {
          flatListRef.current?.scrollToIndex({
            index,
            animated: false, // Changed to false to prevent auto-scrolling issues
            viewPosition: 0.5,
          });
        } catch (error) {
          // Fallback to scrollToOffset if scrollToIndex fails
          flatListRef.current?.scrollToOffset({
            offset: index * itemHeight,
            animated: false,
          });
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [value, options, itemHeight]);

  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const isSelected = item === value;
    const isNearSelected = Math.abs(options.indexOf(value) - index) <= 1;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          { height: itemHeight },
          isSelected && styles.itemSelected,
        ]}
        onPress={() => onChange(item)}
        activeOpacity={0.7}
      >
        <TextDs
          style={[
            styles.itemText,
            isSelected && styles.itemTextSelected,
            !isNearSelected && styles.itemTextFaded,
          ]}
        >
          {formatValue(item)}
        </TextDs>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  return (
    <FlexView style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        nestedScrollEnabled={false}
        scrollEnabled={true}
        onMomentumScrollEnd={(event) => {
          const y = event.nativeEvent.contentOffset.y;
          const index = Math.round(y / itemHeight);
          if (options[index] !== undefined) {
            onChange(options[index]);
          }
        }}
        onScrollToIndexFailed={(info) => {
          // Handle scroll to index failure gracefully
          const wait = new Promise<void>((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            });
          });
        }}
        contentContainerStyle={{
          paddingVertical: itemHeight,
        }}
        style={{ maxHeight: itemHeight * visibleItems }}
      />
      {/* Selection indicator overlay */}
      <FlexView style={styles.selectionIndicator} pointerEvents="none" />
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: 'transparent',
  },
  itemText: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
  },
  itemTextSelected: {
    color: colors.text.primary,
  },
  itemTextFaded: {
    opacity: 0.3,
    ...getFontStyle(16, 'regular'),
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 50,
    marginTop: -25,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
});

