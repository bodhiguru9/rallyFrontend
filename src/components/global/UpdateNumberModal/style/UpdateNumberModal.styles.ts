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
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.medium,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.base,
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  description: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  codeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base,
  },
  whatsappIconContainer: {
    marginRight: spacing.xs,
  },
  whatsappIcon: {
    ...getFontStyle(16, 'regular'),
  },
  codeText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.default,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.base,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  codePickerOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'flex-end',
  },
  codePickerContent: {
    backgroundColor: colors.background.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '60%',
    paddingBottom: spacing.xl,
  },
  codePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  codePickerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  codeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  flag: {
    ...getFontStyle(20, 'regular'),
  },
  codeItemText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
    minWidth: 60,
  },
  countryText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    flex: 1,
  },
});

