import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border.light,
  },
  // Spacing styles (margin top/bottom)
  spacing_xxs: {
    marginVertical: spacing.xxs,
  },
  spacing_xs: {
    marginVertical: spacing.xs,
  },
  spacing_sm: {
    marginVertical: spacing.sm,
  },
  spacing_base: {
    marginVertical: spacing.base,
  },
  spacing_md: {
    marginVertical: spacing.md,
  },
  spacing_lg: {
    marginVertical: spacing.lg,
  },
  spacing_xl: {
    marginVertical: spacing.xl,
  },
  spacing_xxl: {
    marginVertical: spacing.xxl,
  },
});
