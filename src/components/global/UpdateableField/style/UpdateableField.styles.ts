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
    backgroundColor: colors.background.light,
    boxShadow: colors.glass.boxShadow.light,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  updateButton: {
    backgroundColor: colors.background.light,
    boxShadow: colors.glass.boxShadow.light,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    ...getFontStyle(12, 'semibold'),
    color: 'blueGray',
  },
});

