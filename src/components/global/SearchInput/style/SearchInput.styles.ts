import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    alignContent: 'center',
    height: 34,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...getFontStyle(12, 'regular'),
    color: colors.text.white,
    padding: 0,
  },
});
