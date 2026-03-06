import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, avatarSize } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  tabTextActive: {
    color: colors.text.white,
  },
  badge: {
    backgroundColor: colors.text.white,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...getFontStyle(8, 'bold'),
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.white,
  },
  notificationItemUnread: {
    backgroundColor: colors.background.lightYellow,
  },
  userAvatar: {
    width: avatarSize.md,
    height: avatarSize.md,
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  timestamp: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  declineButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyStateText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  loadingText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorSubtext: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  emptySubtext: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
