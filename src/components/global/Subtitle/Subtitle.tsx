import React from 'react';
import { TextDs } from '@designSystem/atoms/TextDs';
import { StyleSheet } from 'react-native';
import { colors, getFontStyle } from '@theme';
import type { SubtitleProps } from './Subtitle.types';

export const Subtitle: React.FC<SubtitleProps> = ({
  variant = 'default',
  children,
  style,
  numberOfLines,
  textAlign,
}) => {
  const variantStyle = styles[variant];

  return (
    <TextDs
      style={[variantStyle, textAlign && { textAlign }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </TextDs>
  );
};

const styles = StyleSheet.create({
  default: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  small: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  large: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.secondary,
  },
  tertiary: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.tertiary,
  },
});
