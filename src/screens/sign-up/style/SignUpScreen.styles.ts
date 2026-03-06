import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing } from '@theme';

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  logoText: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    letterSpacing: -1,
  },
  logoDot: {
    position: 'absolute',
    top: 2,
    left: 28,
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#A8E063',
  },
  tagline: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
  },
  mainContent: {
    flex: 1,
    paddingInline: spacing.sm,
  },
  heading: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xxxl,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  signInText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.secondary,
  },
  signInLink: {
    ...getFontStyle(16, 'medium'),
    color: colors.primary,
  },
  signUpText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.secondary,
  },
  signUpLink: {
    ...getFontStyle(16, 'medium'),
    color: colors.primary,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  termsText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  termsLink: {
    ...getFontStyle(8, 'medium'),
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
  bottomSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  bottomSignInText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  bottomSignInLink: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
});
