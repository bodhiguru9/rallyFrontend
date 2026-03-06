import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: withOpaqueForAndroid('rgba(221, 245, 244, 0.34)'),
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    width: 32,
    height: 32,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.base,
    paddingTop: 10,
  },
  featuredSection: {
    marginBottom: spacing.lg,
  },
  featuredTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  featuredContent: {
    gap: spacing.md,
  },
  featuredCard: {
    width: 320,
  },
  filtersScroll: {
    paddingHorizontal: spacing.base,
    marginBottom: 10,
    overflow: 'visible',
    zIndex: 1,
  },
  dateSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  dateSectionAlt: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  dateLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateLabel: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  dateDayLabel: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
  },
  eventsContainer: {
    paddingHorizontal: spacing.base,
    // marginBottom: spacing.sm,
  },
  eventsContainerAlt: {
    paddingHorizontal: spacing.base,
    // marginBottom: spacing.sm,
  },
  eventsContainerLast: {
    paddingHorizontal: spacing.base,
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  errorText: {
    ...getFontStyle(14, 'medium'),
    color: '#DC2626',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...getFontStyle(16, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
  bookAgainCard: {
    width: 80,
    height: 100,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  bookAgainIconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.3)'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  bookAgainAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.5)'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAgainAvatarText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
  bookAgainIconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAgainSocialText: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.white,
  },
  bookAgainNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  bookAgainName: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.primary,
    textAlign: 'center',
    maxWidth: 70,
  },
  bookAgainDot: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#A8E063',
  },
  calendarContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  calendarEventCard: {
    marginBottom: spacing.md,
  },
});
