import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  headerRight: {
    width: 24,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  tabButtonActive: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    ...getFontStyle(14, 'medium'),
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.white,
  },
  emptyState: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyStateText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  eventsContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  loadingContainer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  eventsList: {
    gap: spacing.base,
    paddingBottom: spacing.base,
  },
});
