import React from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';
import type { CardProps } from './Card.types';

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <FlexView style={[styles.card, style]} {...props}>
      {children}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFDEF80",
    borderRadius: borderRadius.xxl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
});
