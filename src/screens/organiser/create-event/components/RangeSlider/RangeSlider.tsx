import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { PanResponder, View } from 'react-native';
import { Users } from 'lucide-react-native';
import { borderRadius, colors } from '@theme';
import type { RangeSliderProps } from './RangeSlider.types';
import { styles } from './style/RangeSlider.styles';
import { FlexView, TextDs } from '@components';

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 5,
  max = 100,
  initialMin = 14,
  initialMax = 26,
  onValueChange,
  containerStyle,
}) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [activeHandle, setActiveHandle] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<View>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const onValueChangeRef = useRef(onValueChange);

  // Keep ref updated with latest callback
  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  }, [onValueChange]);

  useEffect(() => {
    setMinValue(initialMin);
    setMaxValue(initialMax);
  }, [initialMin, initialMax]);

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setSliderWidth(width);
    }
  };

  const getValueFromPosition = useCallback((x: number): number => {
    if (sliderWidth === 0) { return min; }
    const percentage = Math.max(0, Math.min(1, x / sliderWidth));
    return Math.round(min + percentage * (max - min));
  }, [sliderWidth, min, max]);

  const getPositionFromValue = useCallback((value: number): number => {
    if (sliderWidth === 0) { return 0; }
    const percentage = (value - min) / (max - min);
    return percentage * sliderWidth;
  }, [sliderWidth, min, max]);

  // Separate PanResponder for min handle (capture so ScrollView doesn't take the gesture)
  const minHandlePanResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => sliderWidth > 0,
      onStartShouldSetPanResponderCapture: () => sliderWidth > 0,
      onMoveShouldSetPanResponder: () => sliderWidth > 0,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setActiveHandle('min');
      },
      onPanResponderMove: (evt, gestureState) => {
        if (sliderWidth === 0) { return; }
        // Get the handle's current position and add the gesture delta
        const currentPos = getPositionFromValue(minValue);
        const newX = Math.max(0, Math.min(sliderWidth, currentPos + gestureState.dx));
        const newValue = getValueFromPosition(newX);
        const clampedValue = Math.max(min, Math.min(newValue, maxValue - 1));
        setMinValue(clampedValue);
        onValueChangeRef.current?.({ min: clampedValue, max: maxValue });
      },
      onPanResponderRelease: () => {
        setActiveHandle(null);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sliderWidth, minValue, maxValue, min, max, getPositionFromValue, getValueFromPosition]
  );

  // Separate PanResponder for max handle (capture so ScrollView doesn't take the gesture)
  const maxHandlePanResponder = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => sliderWidth > 0,
      onStartShouldSetPanResponderCapture: () => sliderWidth > 0,
      onMoveShouldSetPanResponder: () => sliderWidth > 0,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setActiveHandle('max');
      },
      onPanResponderMove: (evt, gestureState) => {
        if (sliderWidth === 0) { return; }
        // Get the handle's current position and add the gesture delta
        const currentPos = getPositionFromValue(maxValue);
        const newX = Math.max(0, Math.min(sliderWidth, currentPos + gestureState.dx));
        const newValue = getValueFromPosition(newX);
        const clampedValue = Math.max(minValue + 1, Math.min(newValue, max));
        setMaxValue(clampedValue);
        onValueChangeRef.current?.({ min: minValue, max: clampedValue });
      },
      onPanResponderRelease: () => {
        setActiveHandle(null);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sliderWidth, minValue, maxValue, min, max, getPositionFromValue, getValueFromPosition]
  );

  const minPosition = getPositionFromValue(minValue);
  const maxPosition = getPositionFromValue(maxValue);
  const trackWidth = maxPosition - minPosition;

  // Extract panHandlers - now safe since panResponders are not refs
  const minHandlePanHandlers = minHandlePanResponder.panHandlers;
  const maxHandlePanHandlers = maxHandlePanResponder.panHandlers;

  return (
    <FlexView style={[styles.container, containerStyle]}>
      <View
        ref={sliderRef}
        style={styles.sliderContainer}
        onLayout={handleLayout}
        collapsable={false}
      >
        <FlexView width="100%" height={4} backgroundColor="#DBEDF9" />
        {/* Active track */}
        <FlexView
          style={[
            styles.trackActive,
            {
              left: minPosition,
              width: trackWidth,
            },
          ]}
          pointerEvents="none"
        />

        {/* Min handle - must use View so PanResponder handlers are forwarded to native */}
        <View
          style={[
            styles.handle,
            activeHandle === 'min' && styles.handleActive,
            {
              left: minPosition - 12,
            },
          ]}
          {...minHandlePanHandlers}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FlexView position="relative" width="100%" height="100%">
            <FlexView position="absolute" bottom="100%" left={-8} width={40} height={24} borderRadius={borderRadius.md} boxShadow={colors.boxShadow.lowRaised} alignItems="center" justifyContent="center" style={{ experimental_backgroundImage: colors.gradient.mainBackground }}>
              <TextDs size={14} weight="regular" color="blueGray">
                {minValue}
              </TextDs>
            </FlexView>
          </FlexView>
        </View>

        {/* Max handle - must use View so PanResponder handlers are forwarded to native */}
        <View
          style={[
            styles.handle,
            activeHandle === 'max' && styles.handleActive,
            {
              left: maxPosition - 12,
            },
          ]}
          {...maxHandlePanHandlers}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FlexView position="relative" width="100%" height="100%">
            <FlexView position="absolute" bottom="100%" left={-8} width={40} height={24} borderRadius={borderRadius.md} boxShadow={colors.boxShadow.lowRaised} alignItems="center" justifyContent="center" style={{ experimental_backgroundImage: colors.gradient.mainBackground }}>
              <TextDs size={14} weight="regular" color="blueGray">
                {maxValue}
              </TextDs>
            </FlexView>
          </FlexView>
        </View>
      </View>

      <FlexView style={styles.labelRow}>
        <FlexView style={styles.iconLabel}>
          <Users size={16} color={colors.text.secondary} />
          <TextDs style={styles.iconLabelText}>{min}</TextDs>
        </FlexView>
        <FlexView style={styles.iconLabel}>
          <Users size={16} color={colors.text.secondary} />
          <TextDs style={styles.iconLabelText}>{max}</TextDs>
        </FlexView>
      </FlexView >
    </FlexView>
  );
};
