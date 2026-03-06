import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  memberName: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  bookedInfo: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  amount: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
});
