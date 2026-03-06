import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  subtitle: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
  },
  calenderButton: {
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    boxShadow: colors.glass.boxShadow.white,
    paddingInline: spacing.md,
    borderRadius: borderRadius.full,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarLink: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
  scrollView: {
    paddingHorizontal: spacing.base,
  },
  scrollContent: {
    gap: spacing.lg,
  },
  dateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    paddingBottom: spacing.md,
    borderRadius: borderRadius.full,
  },
  dateSelected: {
    backgroundColor: colors.primary,
  },
  dateUnselected: {},
  dateNumber: {
    ...getFontStyle(20, 'bold'),
  },
  textSelected: {
    color: colors.text.white,
  },
  textUnselected: {
    color: colors.text.primary,
  },
});
