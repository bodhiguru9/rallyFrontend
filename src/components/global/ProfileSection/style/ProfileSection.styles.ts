import { StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  content: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
