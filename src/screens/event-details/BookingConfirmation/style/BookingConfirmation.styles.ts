import { colors, spacing, borderRadius, shadows, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    backgroundColor: '#00C94E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  successIcon: {
    width: 60,
    height: 60,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    marginBottom: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  eventOverview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
    gap: 14,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  organizerName: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...getFontStyle(8, 'medium'),
  },
  shareButton: {
    // width: 36,
    // height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCard: {
    backgroundColor: colors.background.lightYellow,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    width: '100%',
    marginBottom: spacing.xxl,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  eventDetailText: {
    ...getFontStyle(14, 'regular'),
    flex: 1,
  },
  amountSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  amountLabel: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  amountRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceIcon: {
    marginRight: spacing.xs,
  },
  amountValue: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  addToCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.white,
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    paddingInline: spacing.sm,
  },
  addToCalendarText: {
    ...getFontStyle(8, 'medium'),
    color: colors.secondary,
  },
  bookingId: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
  doneButton: {
  backgroundColor: colors.primary,
  borderRadius: borderRadius.full,
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.xl,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
},
doneButtonText: {
  ...getFontStyle(16, 'semibold', 'primary'), // Changed from 'bold' to 'semibold'
  color: colors.text.white,
},
footer: {
  paddingHorizontal: spacing.base,
  paddingBottom: spacing.xl,
  paddingTop: spacing.md,
},
});
