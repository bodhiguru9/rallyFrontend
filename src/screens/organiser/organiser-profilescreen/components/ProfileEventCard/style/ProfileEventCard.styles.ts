import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, avatarSize, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.base,
    flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    position: 'relative',
  },
  shareButton: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    padding: spacing.xs,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
    paddingRight: spacing.xl, // Space for share button
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    gap: spacing.xxs,
  },
  tagText: {
    ...getFontStyle(6, 'medium'),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.white,
    backgroundColor: colors.background.tertiary,
  },
  viewAllAvatar: {
    minWidth: avatarSize.xs,
    height: avatarSize.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  viewAllText: {
    ...getFontStyle(6, 'medium'),
    color: colors.text.secondary,
  },
  spotsText: {
    ...getFontStyle(8, 'medium'),
    color: colors.status.success,
  },
  viewsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewsText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
});
