import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { colors, spacing } from '@theme';
import type { ToggleProps } from './Toggle.types';
import { styles } from './style/Toggle.styles';
import { FlexView, TextDs } from '@components';

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  value,
  onValueChange,
  containerStyle,
  activeColor,
  inactiveColor,
}) => {
  const [animatedValue] = React.useState(new Animated.Value(value ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjust based on track width
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor || colors.border.light, activeColor || colors.primary],
  });

  return (
    <FlexView style={[styles.container, containerStyle]}>
      <FlexView gap={spacing.sm} flex={1}>
        <TextDs size={14} weight="medium">{label}</TextDs>
        {description && (
          <TextDs size={10} weight="regular" color="secondary">
            {description}
          </TextDs>
        )}
      </FlexView>
      <TouchableOpacity
        onPress={() => onValueChange(!value)}
        activeOpacity={0.7}
        style={styles.toggleContainer}
      >
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    </FlexView>
  );
};

