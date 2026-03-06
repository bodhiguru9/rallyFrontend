import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, shadows } from '@theme';

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
  monthYearText: {
    ...getFontStyle(16, 'semibold'),
    color: colors.text.primary,
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
  dayText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  dayTextSelected: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  timeSection: {
    marginBottom: spacing.xl,
  },
  timeSectionTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  timeInput: {
    flex: 1,
    maxWidth: 140,
  },
  timeSeparatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxs,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.xs,
    minHeight: 150,
  },
  timePickerColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    position: 'relative',
  },
  timePickerValue: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginHorizontal: spacing.xs,
  },
  timePickerLabel: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  timePickerPeriod: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  timeSeparator: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginHorizontal: spacing.sm,
    alignSelf: 'center',
  },
  frequencySection: {
    marginBottom: spacing.lg,
  },
  frequencyTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  frequencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  frequencyText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  frequencyIcon: {
    marginLeft: spacing.sm,
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
