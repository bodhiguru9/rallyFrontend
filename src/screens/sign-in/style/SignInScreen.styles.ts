import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  mainContent: {
    flex: 1,
    paddingInline: spacing.sm,
  },
  emailContainer: {
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  whatsappLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  whatsappLinkText: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: 0,
  },
  passwordContainer: {
    marginBottom: spacing.md,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.base,
  },
  forgotPasswordText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  resetLink: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  signUpText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.secondary,
  },
  signUpLink: {
    ...getFontStyle(16, 'medium'),
    color: colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    ...getFontStyle(16, 'semibold'),
    color: colors.text.white,
  },
});
