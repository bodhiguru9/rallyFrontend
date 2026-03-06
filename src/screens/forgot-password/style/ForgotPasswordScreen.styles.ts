import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

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
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
    marginTop: spacing.xl,
  },
  logo: {
    width: 150,
    height: 57,
  },
  mainContent: {
    flex: 1,
  },
  heading: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xl,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  sendCodeButton: {
    width: '100%',
    borderRadius: borderRadius.full,
  },
});
