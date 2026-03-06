import { StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    flex: 1,
  },
  iconImage: {
    width: 20,
    height: 20,
  },
});
