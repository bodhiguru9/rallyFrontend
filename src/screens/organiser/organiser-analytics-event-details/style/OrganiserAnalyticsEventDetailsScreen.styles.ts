import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: withOpaqueForAndroid('rgba(205, 223, 232, 0.7)'),
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    marginBottom: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  priceIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  membersList: {
    gap: spacing.sm,
  },
  membersSection: {
    paddingBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.7)'),
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  statCardActive: {
    backgroundColor: colors.primaryDark,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: withOpaqueForAndroid('rgba(61, 111, 146, 0.15)'),
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: colors.status.success,
  },
  joinedTitle: {
    marginBottom: spacing.sm,
  },
  memberCard: {
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.7)'),
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  memberPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
  },
  memberAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
  },
});
