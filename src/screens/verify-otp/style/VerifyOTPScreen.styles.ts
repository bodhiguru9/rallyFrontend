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
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagline: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
  },
  taglineHighlight: {
    ...getFontStyle(12, 'regular'),
    color: '#A8E063',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    paddingHorizontal: spacing.base,
  },
  resendContainer: {
    marginTop: spacing.base,
  },
  resendText: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
  },
  resendTextDisabled: {
    color: colors.text.secondary,
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
  confirmButtonActive: {
    opacity: 1,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    ...getFontStyle(16, 'semibold'),
    color: colors.text.white,
  },
  confirmButtonTextDisabled: {
    opacity: 0.7,
  },
});
