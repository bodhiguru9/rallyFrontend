// BookingModal.styles.ts
import { colors, spacing, borderRadius, shadows, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomFixedSection: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    backgroundColor: "#DDF5F4",
  },
  persistentFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'white', // Or transparent if BackdropBlur covers it
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Add shadow to make it pop like the image
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light, // subtle divider
    marginBottom: spacing.sm,
  },
  modalHeaderButtonContainer: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: '#DDF5F4',
  },
  // Ensure the modal container doesn't have extra padding at the top 
  // that would disconnect the button from the handle
  paymentSummaryCard: {
    backgroundColor: "#DDF5F4",
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderWidth: 2, // Increased from 1
    borderColor: '#FF0000', // Red border for debugging
  },
  paymentSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentSummaryLabel: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  paymentSummaryAmount: {
    ...getFontStyle(16, 'semibold'),
    color: colors.text.blueGray,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add semi-transparent backdrop
    justifyContent: 'flex-end', // Position modal at bottom
  },
  modalContainer: {
    padding: spacing.md,
    backgroundColor: '#DDF5F4',
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    maxHeight: '70%', // Takes up to 90% of screen height
    minHeight: 200,
    ...shadows.lg,
    paddingTop: spacing.xs,
  },





  handleBarContainer: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.medium,
    borderRadius: borderRadius.full,
  },
  scrollContent: {
    paddingBottom: spacing.base,
    paddingTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
    padding: spacing.md
  },
  sectionTitle: {
    ...getFontStyle(14, 'bold'),
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
    backgroundColor: '#effcffff',
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
    ...getFontStyle(10, 'regular'), // Changed from whatever it was to 10px
    color: '#8A8A8A', // Changed to exact color from Figma
    textAlign: 'center',
    paddingHorizontal: spacing.base,
    marginTop: spacing.md,
    lineHeight: 14, // Added for better readability
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  bookEventButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
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
    marginInline: spacing.md,
    marginTop: spacing.md,
  },
  applePayButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
});
