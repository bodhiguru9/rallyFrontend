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

