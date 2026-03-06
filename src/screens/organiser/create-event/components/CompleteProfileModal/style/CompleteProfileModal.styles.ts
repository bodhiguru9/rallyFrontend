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
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  selectContainer: {
    marginBottom: 0,
  },
  inputContainer: {
    marginBottom: 0,
  },
  emiratesIdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  emiratesIdLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
  uploadCount: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.secondary,
  },
  emiratesIdInstruction: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  uploadHint: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  imagePreviewsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});

