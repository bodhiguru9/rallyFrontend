import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formContainer: {
    flex: 1,
    gap: spacing.base,
    alignContent: "center"
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.base,
    paddingHorizontal: spacing.sm,
  },
  infoIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    // backgroundColor: colors.background.cream || '#FEFDFB',
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: "#bdcbd8ff",
  },
  confirmButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  avatarRequiredHint: {
    marginTop: spacing.xs,
    alignSelf: 'center',
  },
  rolePill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  addSportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7fa1baff',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  addSportButtonText: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.white,
  },
});
