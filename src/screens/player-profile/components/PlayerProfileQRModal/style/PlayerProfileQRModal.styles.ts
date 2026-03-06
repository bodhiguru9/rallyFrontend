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
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '90%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...getFontStyle(18, 'bold'),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  linkContainer: {
    marginBottom: spacing.xl,
  },
  linkLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  linkText: {
    ...getFontStyle(12, 'regular'),
    color: colors.primary,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
});
