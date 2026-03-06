import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.base,
    padding: spacing.xs,
  },
  headerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.base,
  },
  contentContainer: {
    backgroundColor: '#E0F7F5', // Light blue-green background (same as PasswordModal)
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  contentHeader: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
  inputsContainer: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.base,
  },
  forgotPasswordContainer: {
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    ...getFontStyle(12, 'regular'),
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonActive: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  confirmButtonTextDisabled: {
    color: colors.text.tertiary,
  },
});
