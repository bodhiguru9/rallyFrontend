import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, avatarSize } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.text.tertiary,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.base,
  },
  searchContainer: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  searchInput: {
    backgroundColor: colors.surface.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  sectionTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organisersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  organiserCard: {
    alignItems: 'center',
    width: '30%',
  },
  organiserAvatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  organiserAvatar: {
    width: avatarSize.xxl,
    height: avatarSize.xxl,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.verified.background,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organiserNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organiserName: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    textAlign: 'center',
  },
  eventsContainer: {
    gap: spacing.base,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  eventImage: {
    width: 100,
    height: 120,
    backgroundColor: colors.background.secondary,
  },
  eventContent: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'space-between',
  },
  eventTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  eventOrganiser: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatarsContainer: {
    flexDirection: 'row',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.surface.background,
  },
  viewAllButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.background,
  },
  viewAllText: {
    ...getFontStyle(6, 'medium'),
    color: colors.text.secondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  spotsAvailable: {
    ...getFontStyle(6, 'regular'),
    color: colors.status.success,
    marginBottom: spacing.xs / 2,
  },
  price: {
    ...getFontStyle(14, 'bold'),
    color: colors.primary,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
