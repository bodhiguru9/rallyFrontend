import { StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.base,
  },
  eventsList: {
    gap: spacing.base,
  },
});

