import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';

export const styles = StyleSheet.create({
  dateOption: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  dateOptionSelected: {
    backgroundColor: colors.primary,
  },
});
