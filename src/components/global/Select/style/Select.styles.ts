import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    borderColor: colors.border.white,
    flex: 1,
  },
  selectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingRight: spacing.xl + spacing.sm,
  },
  selectButtonError: {
    borderColor: colors.status.error,
  },
  selectButtonDisabled: {
    backgroundColor: '#E8E8E8',
    opacity: 0.6,
  },
  selectButtonWithLeftIcon: {
    paddingLeft: spacing.xl + spacing.sm,
  },
  leftIconContainer: {
    zIndex: 1,
  },
  selectText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  selectTextPlaceholder: {
    color: colors.text.tertiary,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  optionItemSelected: {
    backgroundColor: colors.background.secondary,
  },
  optionText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  optionTextSelected: {
    ...getFontStyle(14, 'medium'),
    color: colors.primary,
  },
});
