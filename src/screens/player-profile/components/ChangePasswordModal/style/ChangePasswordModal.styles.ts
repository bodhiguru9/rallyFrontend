import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#E0F7F5', // Light blue-green background (same as PasswordModal)
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxHeight: '80%',
  },
  header: {
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
    backgroundColor: '#FFFFFF', // White background for better visibility
    borderRadius: borderRadius.lg,
    boxShadow: colors.glass.boxShadow.light,
    paddingHorizontal: spacing.md,
    minHeight: 48, // Ensure proper height
  },
  inputText: {
    color: '#000000', // Explicit black text color for visibility
    fontSize: 16,
  },
  forgotPasswordContainer: {
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    ...getFontStyle(14, 'bold'),
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

