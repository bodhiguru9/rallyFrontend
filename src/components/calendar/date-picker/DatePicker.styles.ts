import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
  datePickerWrapper: {
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  datePickerContainer: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
});
