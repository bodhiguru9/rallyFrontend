import { StyleSheet } from 'react-native';
import { spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
    color: '#FF8C42',
  },
  text: {
    ...getFontStyle(8, 'medium'),
    color: '#FF8C42',
  },
});
