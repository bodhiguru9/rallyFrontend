import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
    gap: spacing.sm,
    flex: 1,
  },

  inputError: {
    borderColor: colors.status.error,
  },
  leftIconContainer: {
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: spacing.base,
    zIndex: 1,
  },
  dateButton: {
    flex: 1,
    paddingRight: spacing.xl + spacing.sm,
  },
  dateText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
  },
  dateTextPlaceholder: {
    color: colors.text.tertiary,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
});
