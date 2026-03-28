import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, avatarSize } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerSide: {
    minWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  markAllButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  markAllText: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
  tabWrapper: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  tabContainer: {
    margin: 0,
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
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: 'transparent',
  },
  notificationItemUnread: {
    backgroundColor: 'rgba(91, 124, 153, 0.15)',
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
    marginBottom: spacing.xs,
  },
  timestamp: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  notificationActionButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  notificationActionButtonText: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.white,
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
  dateSeparator: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.primary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
});
