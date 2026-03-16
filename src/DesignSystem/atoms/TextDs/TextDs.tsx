import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors, getFontStyle, typography } from '@theme';
import type { TextProps } from './Text.types';

/**
 * Text component with size, weight, and color props.
 * Size is numeric from theme: 6, 8, 10, 12, 14, 16, 20.
 *
 * @example
 * <TextDs size={16} weight="bold" color="primary">Hello World</TextDs>
 *
 * @example
 * <TextDs size={14} weight="regular" color="secondary" align="center">
 *   Centered text
 * </TextDs>
 */
export const TextDs: React.FC<TextProps> = ({
  size = 14,
  weight = 'regular',
  color = 'primary',
  children,
  align = 'left',
  numberOfLines,
  marginTop,
  style,
  accessibilityLabel,
  lineHeight,
  testID,
}) => {
  const fontStyle = getFontStyle(size, weight);
  const resolvedColor = getColorValue(color);
  const resolvedLineHeight = lineHeight ? typography.lineHeight[lineHeight] : undefined;

  return (
    <RNText
      style={[
        styles.base,
        fontStyle,
        { color: resolvedColor, textAlign: align },
        resolvedLineHeight !== undefined && { lineHeight: resolvedLineHeight },
        marginTop !== undefined && { marginTop },
        style,
      ]}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </RNText>
  );
};

const getColorValue = (color: string): string => {
  if (color in colors.text) {
    return colors.text[color as keyof typeof colors.text];
  }
  if (color in colors.status) {
    return colors.status[color as keyof typeof colors.status];
  }
  // @ts-ignore - Handle direct color keys like 'red'
  if (color in colors) {
    return (colors as any)[color];
  }
  if (color === 'primary') {
    return colors.primary;
  }
  if (color === 'secondary') {
    return colors.secondary;
  }
  if (color === 'accent') {
    return colors.accent;
  }
  if (color === 'white') {
    return '#FFFFFF';
  }
  if (color === 'black') {
    return '#000000';
  }
  // Handle hex colors directly
  if (color.startsWith('#')) {
    return color;
  }
  return colors.text.primary;
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
