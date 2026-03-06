import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#E0F7F5', // Light blue-green background
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.medium,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  header: {
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  description: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpContainer: {
    marginBottom: spacing.lg,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendText: {
    ...getFontStyle(12, 'regular'),
    color: colors.primary,
  },
  resendTextDisabled: {
    color: colors.text.tertiary,
  },
  sendButton: {
    backgroundColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  sendButtonTextDisabled: {
    color: colors.text.tertiary,
  },
});

