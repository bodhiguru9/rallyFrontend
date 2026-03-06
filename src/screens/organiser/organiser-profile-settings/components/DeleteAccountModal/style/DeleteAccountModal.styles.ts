import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.base,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  timerText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  closeButton: {
    backgroundColor: colors.primaryDark,
  },
  deleteButton: {
    backgroundColor: colors.button.cancel.background,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...getFontStyle(16, 'semibold'),
  },
  closeButtonText: {
    color: colors.text.white,
  },
  deleteButtonText: {
    color: colors.button.cancel.text,
  },
});
