import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    experimental_backgroundImage: colors.gradient.mainBackground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    maxHeight: '90%',
    overflow: 'hidden',
    zIndex: 20,
  },
  contentContainer: {},
  dateSection: {},
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  monthNavigationButton: {
    padding: spacing.sm,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dayOfWeek: {
    flex: 1,
    alignItems: 'center',
  },
  dayOfWeekText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    height: 160,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1 / 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    aspectRatio: 1 / 1,
  },
  dayCellDisabled: {
    opacity: 0.35,
  },
  dayText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  dayTextSelected: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  dayTextDisabled: {
    color: colors.text.tertiary,
  },
  timeSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  timeSectionTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInput: {
    flex: 1,
    maxWidth: 120,
  },
  errorText: {
    ...getFontStyle(12, 'regular'),
    color: colors.status.error,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
});
