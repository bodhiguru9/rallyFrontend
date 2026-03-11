import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  cardInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardNumber: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  expiryDate: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  removeButton: {
    backgroundColor: '#FFE5E5', // Light pink background
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  removeButtonText: {
    ...getFontStyle(10, 'semibold'),
    color: 'red',
  },
});

