import React from 'react';
import { TextDs } from '@designSystem/atoms/TextDs';
import { StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';
import type { TitleProps } from './Title.types';

export const Title: React.FC<TitleProps> = ({
  variant,
  children,
  style,
  numberOfLines,
  textAlign,
}) => {
  const variantStyle = styles[variant];

  return (
    <TextDs style={[variantStyle, textAlign && { textAlign }, style]} numberOfLines={numberOfLines}>
      {children}
    </TextDs>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  headerTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  mapText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
