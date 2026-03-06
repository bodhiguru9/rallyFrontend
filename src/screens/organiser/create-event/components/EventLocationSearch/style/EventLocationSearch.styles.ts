import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    gap: 4,
    zIndex: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
    paddingVertical: 0,
  },
  leftIconContainer: {},
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    marginTop: spacing.xs,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    maxHeight: 220,
    zIndex: 4000,
  },
  /** Fixed height so FlatList has bounded size and scrolls when many suggestions. */
  dropdownListWrap: {
    height: 200,
  },
  suggestionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionItemPressed: {
    backgroundColor: colors.interactive.pressed,
  },
  suggestionText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  suggestionSubtext: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginTop: 2,
  },
  loadingRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
  },
  emptyRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  errorRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  errorText: {
    ...getFontStyle(14, 'regular'),
    color: colors.status.error,
  },
});
