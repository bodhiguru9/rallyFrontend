import { colors, spacing, borderRadius, shadows, getFontStyle, withOpaqueForAndroid } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.base,
  },
  featuredSection: {
    paddingVertical: spacing.lg,
    paddingTop: spacing.xl,
  },
  featuredTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  featuredContent: {
    gap: spacing.md,
  },
  featuredCard: {
    width: 320,
  },
  pickedTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
    marginTop: spacing.base,
  },
  filtersScroll: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  dateSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  dateSectionAlt: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.lg,
  },
  dateSectionWithMargin: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingTop: spacing.lg,
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
    marginBottom: spacing.sm,
  },
  eventsContainerAlt: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  eventsContainerLast: {
    paddingHorizontal: spacing.base,
    paddingBottom: 120,
  },
  bottomNav: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.xl,
    right: spacing.xl,
    borderRadius: borderRadius.xxl,
  },
  bottomNavContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  navButtonActive: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.2)'),
    borderRadius: borderRadius.full,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
  },
  loadingContainer: {
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
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...getFontStyle(14, 'medium'),
    color: '#DC2626',
    textAlign: 'center',
  },
  emptyContainer: {
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
});
