import React from 'react';
import { TextDs, FlexView } from '@components';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';

import {StyleProp} from 'react-native';

interface PlanSectionProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // Add this line
  titleStyle?: StyleProp<TextStyle>; // Good to have for custom titles too
}

export const PlanSection: React.FC<PlanSectionProps> = ({ 
  title, 
  children, 
  style, // Destructure style here
  titleStyle 
}) => {
  return (
    <FlexView style={[styles.container, style]}> 
      {title ? <TextDs style={[styles.title, titleStyle]}>{title}</TextDs> : null}
      {children}
    </FlexView>
  );
};
const styles = StyleSheet.create({
  outer: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: withOpaqueForAndroid('rgba(255,255,255,0.70)'),
    padding: spacing.md,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});
