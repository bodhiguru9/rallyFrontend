import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.base,
  },
  modalContainer: {
    width: '95%',
    maxWidth: 980,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.xl,
  },
  modalContent: {
    padding: spacing.xl,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    marginBottom: spacing.lg,
    paddingRight: spacing.xxl,
  },
  eventTitle: {
    ...getFontStyle(18, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  organizerName: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  spotsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  spotsText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  spotsAvailableText: {
    ...getFontStyle(12, 'medium'),
    color: colors.status.success,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.status.success,
    borderRadius: borderRadius.full,
  },
  participantsScrollView: {
    width: '100%',
  },
  participantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  participantItem: {
    alignItems: 'center',
    width: '22%',
    marginBottom: spacing.md,
  },
  participantAvatarWrap: {
    marginBottom: spacing.xs,
  },
  participantName: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
    textAlign: 'center',
    maxWidth: '100%',
  },
  emptyAvatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  emptyAvatarText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.tertiary,
  },
});
