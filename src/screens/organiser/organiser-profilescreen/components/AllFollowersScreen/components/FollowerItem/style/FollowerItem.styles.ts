import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, avatarSize, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  avatarContainer: {
    marginRight: spacing.base,
  },
  avatar: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  avatarPlaceholder: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  name: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  removeButton: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  removeButtonText: {
    ...getFontStyle(12, 'medium'),
    color: '#FF4444',
  },
});

