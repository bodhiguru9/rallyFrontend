import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  upgradeBadge: {
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  upgradeBadgeText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl * 2,
  },
  titleBlock: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
  },
  subtitle: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  planCard: {
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planIconCircle: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: withOpaqueForAndroid('rgba(61, 111, 146, 0.12)'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthlyPill: {
    backgroundColor: withOpaqueForAndroid('rgba(255,255,255,0.65)'),
    borderWidth: 1,
    borderColor: colors.border.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  monthlyPillText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  currency: {
    ...getFontStyle(16, 'bold'),
    color: colors.primary,
    marginRight: 4,
    marginBottom: 2,
  },
  price: {
    ...getFontStyle(20, 'bold'),
    color: colors.primary,
  },
  perMonth: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    marginLeft: 6,
    marginBottom: 4,
  },
  renewText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  featuresList: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  paymentCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  paymentText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardMasked: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    flex: 1,
  },
  cardExpiry: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  changePill: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  changePillText: {
    ...getFontStyle(8, 'medium'),
    color: '#FF4444',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: withOpaqueForAndroid('rgba(232, 245, 233, 0.95)'),
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
});
