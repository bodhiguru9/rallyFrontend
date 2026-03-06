import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  displayField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  displayText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#FFCDD2',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
  },
  removeButtonText: {
    ...getFontStyle(12, 'semibold'),
    color: '#F44336',
  },
});

