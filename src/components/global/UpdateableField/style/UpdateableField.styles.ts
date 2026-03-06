import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  updateButton: {
    backgroundColor: '#64B5F6',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.white,
  },
});

