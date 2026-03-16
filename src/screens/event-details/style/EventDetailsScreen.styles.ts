import { colors, spacing, borderRadius, shadows, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  persistentFooter: {
    // Remove position: 'absolute', bottom: 0, etc.
    backgroundColor: 'white', // Matches the modal background
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // Shadow to give it that "elevated" look from the image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  footerTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    // marginBottom: spacing.sm,
    // Very light divider
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    // paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFDEF80",
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.white,
    marginBottom: spacing.base,
  },
  eventOverview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  organizerName: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.xs,
  },
  categoryText: {
    ...getFontStyle(8, 'medium'),
  },
  shareButton: {
    // width: 36,
    // height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  infoText: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  mapContainer: {
    marginTop: spacing.md,
    height: 150,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  cardTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  membersSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  guestsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  selectorButton: {
    padding: spacing.xs,
  },
  guestsCount: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginHorizontal: spacing.sm,
    minWidth: 30,
    textAlign: 'center',
  },
  spotsAndParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    justifyContent: 'flex-end',
  },
  spotsAvailable: {
    ...getFontStyle(12, 'medium'),
    color: colors.status.success,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatarWrap: {
    marginRight: 0,
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.white,
  },
  organizerAvatarWrap: {
    marginRight: spacing.md,
  },
  moreParticipants: {
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.background.white,
  },
  moreParticipantsText: {
    ...getFontStyle(8, 'semibold'),
    color: colors.text.secondary,
  },
  refundText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  descriptionText: {
    ...getFontStyle(12, 'regular'),
    fontFamily: 'System', // Use system font for emoji support
    color: colors.text.secondary,
    lineHeight: 20,
  },
  restrictionsText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
  },

  organizerInfo: {
    flex: 1,
  },
  organizerStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  paymentSectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  paymentMethodText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  bookingIdText: {
    ...getFontStyle(10, 'regular'),
    color: colors.text.tertiary,
  },
  statText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  paymentContent: {
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginBottom: spacing.md,
  },
  paymentText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  totalLabel: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  totalPrice: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  priceIcon: {
    marginRight: spacing.xs,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.md,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: colors.border.default,
    opacity: 0.6,
  },
  bookButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
  approvalBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: spacing.base,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  approvalContent: {
    flex: 1,
  },
  approvalTitle: {
    ...getFontStyle(14, 'semibold'),
    color: '#92400E',
    marginBottom: spacing.xs,
  },
  approvalText: {
    ...getFontStyle(12, 'regular'),
    color: '#78350F',
    lineHeight: 18,
  },
  cancelButton: {
    backgroundColor: '#EAD9CF',
    borderRadius: 50,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cancelButtonText: {
    ...getFontStyle(14, 'medium'),
    color: '#CD5C5C',
  },
  cancelButtonDisabled: {
    backgroundColor: colors.border.default,
    opacity: 0.6,
  },
  cancelButtonTextDisabled: {
    color: colors.text.secondary,
  },
  //   persistentFooter: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: 'white',
  //   borderTopLeftRadius: 24, // Matches the rounded look in your image
  //   borderTopRightRadius: 24,
  //   // Shadow to separate it from the ScrollView content
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: -4 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 10,
  // },
  // footerTotalRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   paddingBottom: spacing.sm,
  //   marginBottom: spacing.sm,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#F0F0F0', // Light divider
  // }
});
