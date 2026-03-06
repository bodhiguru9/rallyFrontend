import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card.primary,
    borderRadius: borderRadius.xxl,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.white,
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
  shareButton: {
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
  guestAllowanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  guestAllowanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  guestAllowanceText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  spotsAvailable: {
    ...getFontStyle(12, 'medium'),
    color: colors.status.success,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatarWrap: {},
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.background.white,
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
  eventTypeText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  refundPolicyText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EAD9CF',
    borderRadius: 50,
    paddingVertical: spacing.md,
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
    ...getFontStyle(16, 'medium'),
    color: '#CD5C5C',
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: spacing.md,
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
  editButtonText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
  },
});
