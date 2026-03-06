import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  sheetBackground: {
    experimental_backgroundImage: colors.gradient.mainBackground,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  sheetContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 16,
  },
  contentWrap: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  form: {
    paddingBottom: spacing.base,
  },
  input: {
    marginTop: spacing.sm,
  },
  dropdownLabel: {
    ...getFontStyle(16, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  dropdownTriggerText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
  },
  twoCol: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  col: {
    flex: 1,
  },
  fakeSelectWrap: {
    marginTop: spacing.sm,
  },
  fakeSelectLabel: {
    ...getFontStyle(16, 'medium'),
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  fakeSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  fakeSelectText: {
    ...getFontStyle(20, 'regular'),
    color: colors.text.tertiary,
    flex: 1,
    marginRight: spacing.sm,
  },
  eventsPriceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eventsCol: {
    flex: 1,
  },
  priceCol: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#5B8FB8',
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
  },
  confirmText: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.white,
  },
  pickerHeader: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  pickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: withOpaqueForAndroid('rgba(0,0,0,0.35)'),
  },
  pickerSheet: {
    backgroundColor: '#E8F5E9',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  pickerHandle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  pickerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  pickerList: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  pickerItem: {
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pickerItemText: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
});
