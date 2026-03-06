import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  value: {
    ...getFontStyle(20, 'bold'),
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  label: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

