import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  container: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  pickerButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.lightYellow,
    borderRadius: borderRadius.lg,
  },
  previewLabel: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  previewValue: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  pickerModal: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    width: '100%',
    maxWidth: 300,
    maxHeight: 400,
  },
  pickerModalTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
  },
  pickerItemSelected: {
    backgroundColor: colors.background.lightYellow,
  },
  pickerItemText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  pickerItemTextSelected: {
    ...getFontStyle(14, 'semibold'),
    color: colors.primary,
  },
  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  doneButtonText: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.white,
  },
});
