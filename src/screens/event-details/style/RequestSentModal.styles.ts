import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.default,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  iconContainer: {
    alignItems: 'center',
  },
  hourglassIcon: {
    maxWidth: 130,
    maxHeight: 130,
    objectFit: 'contain',
  },
  hourglassTop: {
    width: 32,
    height: 16,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  hourglassBottom: {
    width: 32,
    height: 16,
    backgroundColor: '#F59E0B',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  organizerName: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    ...getFontStyle(8, 'medium'),
  },
  shareButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.base,
  },
  detailsContainer: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    flex: 1,
  },
  amountContainer: {
    gap: spacing.sm,
  },
  amountLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.secondary,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountValue: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
  },
  priceIcon: {
    marginRight: spacing.xs,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
  },
  calendarText: {
    ...getFontStyle(8, 'medium'),
    color: colors.primary,
  },
  bookingId: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  buttonContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.base,
  },
doneButton: {
    backgroundColor: colors.primary, 
    borderRadius: borderRadius.full, // Note: If you want it truly edge-to-edge, you might want to change this to 0
    paddingVertical: spacing.md, // Slightly increased vertical padding since we removed it from the text
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'stretch', // Forces the button to stretch to the parent's full width
  },
  doneButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
    lineHeight: 16,
    // REMOVED: padding and borderRadius from here. Text shouldn't handle button structure.
  },
});
