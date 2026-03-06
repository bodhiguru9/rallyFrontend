import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@theme';

export const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: 100,
  },
  eventNameInput: {
    marginBottom: 0,
  },
  selectContainer: {
    marginBottom: 0,
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.base,
  },
  restrictionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  restrictionIcon: {
    width: 16,
    height: 16,
    tintColor: colors.text.white,
  },
  fieldIcon: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
  noMarginInput: {
    marginBottom: 0,
  },
  toggleContainer: {
    marginBottom: spacing.xs,
  },
  checkboxContainer: {
    marginBottom: spacing.base,
  },
  blurContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  createButton: {
    width: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  blurFill: StyleSheet.absoluteFillObject,
  createButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTimeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  registrationInputTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  registrationInputTouchableDisabled: {
    opacity: 0.6,
  },
  registrationInputInner: {
    flex: 1,
  },
});
