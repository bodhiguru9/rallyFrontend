import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, shadows } from '@theme';

export const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    experimental_backgroundImage: colors.gradient.mainBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '90%',
    maxWidth: 400,
    maxHeight: '85%',
    zIndex: 10,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    flexShrink: 0,
  },
  modalTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
    marginRight: -spacing.xs,
  },
  scrollView: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
    flexGrow: 1,
  },
  content: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  selectContainer: {
    marginBottom: 0,
  },
  ageRangeContainer: {
    gap: spacing.sm,
  },
  inputContainer: {
    marginBottom: 0,
  },
  helpText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  errorText: {
    ...getFontStyle(12, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    flexShrink: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.button.cancel.background,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.button.cancel.text,
  },
  doneButton: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
