import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.status.error}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  warningSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.xl,
  },
  warningTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.status.error,
    marginBottom: spacing.sm,
  },
  warningText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  infoList: {
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bullet: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  infoText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.status.error,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.background.white,
  },
});
