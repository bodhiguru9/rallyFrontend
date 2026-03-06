import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  active: {
    backgroundColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  label: {
    ...getFontStyle(12, 'medium'),
  },
  labelActive: {
    color: colors.text.white,
  },
  labelInactive: {
    color: colors.text.primary,
  },
});
