import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';

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
    paddingBottom: spacing.xxxl,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.white,
    marginBottom: spacing.lg,
  },
  upgradeIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeIconText: {
    ...getFontStyle(12, 'bold'),
    color: colors.text.primary,
  },
  upgradeContent: {
    flex: 1,
  },
  upgradeTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  upgradeSubtitle: {
    ...getFontStyle(10, 'regular'),
    color: colors.text.secondary,
    marginTop: spacing.xxs,
  },
  upgradeArrow: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.secondary,
  },
  toggleRow: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border.light,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xs,
  },
  signOutButton: {
    backgroundColor: withOpaqueForAndroid('rgba(245, 204, 196, 0.6)'),
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
  },
  signOutText: {
    ...getFontStyle(14, 'bold'),
    color: colors.status.error,
  },
});
