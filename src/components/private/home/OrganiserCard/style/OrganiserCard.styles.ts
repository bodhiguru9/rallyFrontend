import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, avatarSize, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing.base,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: avatarSize.xxl,
    height: avatarSize.xxl,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.verified.background,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  name: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    textAlign: 'center',
    maxWidth: 70,
  },
});
