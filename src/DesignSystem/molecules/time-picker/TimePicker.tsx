import React, { useRef, useEffect, useCallback } from 'react';
import { TextDs, FlexView } from '@components';
import { ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@theme';
import type { TimePickerProps } from './TimePicker.types';

const ITEM_HEIGHT = 40;

// Generate values
const hourValues12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const hourValues24 = Array.from({ length: 24 }, (_, i) => i); // 0-23
const minuteValuesByInterval: Record<15 | 10, number[]> = {
  15: [0, 15, 30, 45],
  10: [0, 10, 20, 30, 40, 50],
};
const periodValues: Array<'AM' | 'PM'> = ['AM', 'PM'];

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  containerStyle,
  disabled = false,
  use24Hour = false,
  minuteInterval = 15,
}) => {
  const minuteValues = minuteValuesByInterval[minuteInterval];
  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  const hourValues = use24Hour ? hourValues24 : hourValues12;

  // Initialize scroll positions only once on mount
  useEffect(() => {
    const hourIndex = hourValues.indexOf(value.hour);
    const minuteIndex = minuteValues.indexOf(value.minute);
    const periodIndex = periodValues.indexOf(value.period);

    const timer = setTimeout(() => {
      if (hourScrollRef.current && hourIndex !== -1) {
        hourScrollRef.current.scrollTo({
          y: hourIndex * ITEM_HEIGHT,
          animated: false,
        });
      }

      if (minuteScrollRef.current && minuteIndex !== -1) {
        minuteScrollRef.current.scrollTo({
          y: minuteIndex * ITEM_HEIGHT,
          animated: false,
        });
      }

      if (!use24Hour && periodScrollRef.current && periodIndex !== -1) {
        periodScrollRef.current.scrollTo({
          y: periodIndex * ITEM_HEIGHT,
          animated: false,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHourScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled) {
      return;
    }

    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(Math.round(yOffset / ITEM_HEIGHT), hourValues.length - 1));
    const selectedHour = hourValues[index];

    if (selectedHour !== undefined && selectedHour !== value.hour) {
      onChange({ ...value, hour: selectedHour });
    }
  }, [disabled, value, onChange]);

  const handleMinuteScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled) {
      return;
    }

    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(Math.round(yOffset / ITEM_HEIGHT), minuteValues.length - 1));
    const selectedMinute = minuteValues[index];

    if (selectedMinute !== undefined && selectedMinute !== value.minute) {
      onChange({ ...value, minute: selectedMinute });
    }
  }, [disabled, value, onChange]);

  const handlePeriodScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (disabled) {
      return;
    }

    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(Math.round(yOffset / ITEM_HEIGHT), periodValues.length - 1));
    const selectedPeriod = periodValues[index];

    if (selectedPeriod !== undefined && selectedPeriod !== value.period) {
      onChange({ ...value, period: selectedPeriod });
    }
  }, [disabled, value, onChange]);

  const renderPickerItem = (itemValue: number | string, padHour = false) => {
    const displayValue =
      typeof itemValue === 'number'
        ? padHour
          ? String(itemValue).padStart(2, '0')
          : itemValue < 10 && minuteValues.includes(itemValue)
            ? String(itemValue).padStart(2, '0')
            : String(itemValue)
        : itemValue;

    return (
      <FlexView key={itemValue} style={styles.pickerItem}>
        <TextDs
          style={[
            styles.pickerItemText,
          ]}
        >
          {displayValue}
        </TextDs>
      </FlexView>
    );
  };

  return (
    <FlexView style={[styles.container, containerStyle, disabled && styles.disabled]} pointerEvents={disabled ? 'none' : 'box-none'}>
      <FlexView style={styles.pickerWrapper}>
        {/* Selection highlight background */}
        <FlexView style={styles.selectionHighlight} pointerEvents="none" />

        {/* Hour Picker */}
        <ScrollView
          ref={hourScrollRef}
          style={styles.pickerColumn}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={handleHourScroll}
        >
          {hourValues.map((hour) => renderPickerItem(hour, use24Hour))}
        </ScrollView>

        {/* Minute Picker */}
        <ScrollView
          ref={minuteScrollRef}
          style={styles.pickerColumn}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate="fast"
          onMomentumScrollEnd={handleMinuteScroll}
        >
          {minuteValues.map((minute) => renderPickerItem(minute))}
        </ScrollView>

        {/* Period Picker (AM/PM) - hidden in 24-hour mode */}
        {!use24Hour && (
          <ScrollView
            ref={periodScrollRef}
            style={styles.pickerColumn}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="center"
            decelerationRate="fast"
            onMomentumScrollEnd={handlePeriodScroll}
          >
            {periodValues.map((period) => renderPickerItem(period))}
          </ScrollView>
        )}
      </FlexView>
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.base,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: ITEM_HEIGHT * 3,
  },
  selectionHighlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    borderRadius: borderRadius.lg,
    zIndex: 0,
  },
  pickerColumn: {
    height: ITEM_HEIGHT * 3,
    width: 80,
    marginHorizontal: spacing.xs,
  },
  scrollContentContainer: {
    paddingVertical: ITEM_HEIGHT,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: typography.fontSize[20],
    fontFamily: typography.fontFamily.primary,
  },
  pickerItemTextSelected: {
    fontSize: typography.fontSize[20],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  pickerItemTextUnselected: {
    fontSize: typography.fontSize[16],
    color: colors.text.tertiary,
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },
});
