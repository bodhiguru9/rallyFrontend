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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  scrollContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    backgroundColor: colors.primary,
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    minHeight: 48,
  },
  promoCodeInput: {
    flex: 1,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    padding: 0,
  },
  promoCodeArrow: {
    marginLeft: spacing.sm,
  },
  paymentDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  paymentDetailsContent: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  paymentLabel: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  paymentAmount: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
  paymentDiscount: {
    ...getFontStyle(12, 'medium'),
    color: colors.secondary,
  },
  paymentDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  totalLabel: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  totalPrice: {
    ...getFontStyle(16, 'bold'),
    color: colors.secondary,
  },
  priceIcon: {
    marginRight: spacing.xs,
  },
  cardInputFullWidth: {
    marginBottom: spacing.md,
  },
  cardInputsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cardInputContainer: {
    flex: 1,
  },
  cardInput: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    minHeight: 48,
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  cardInputText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  cardInputPlaceholder: {
    color: colors.text.tertiary,
  },
  cardInputTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disclaimer: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    lineHeight: 16,
  },
  buttonsContainer: {
    gap: spacing.md,
    padding: spacing.base,
    paddingBottom: spacing.xl,
    backgroundColor: colors.primary,
  },
  bookEventButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookEventButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
  applePayButton: {
    backgroundColor: colors.text.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applePayButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
});
