import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F5E9', // Light green background
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background.secondary,
  },
  shareButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.9)'),
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },
  content: {
    padding: spacing.base,
  },
  title: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  tagText: {
    ...getFontStyle(8, 'medium'),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.background.white,
    backgroundColor: colors.background.secondary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
  },
  viewAllButton: {
    backgroundColor: colors.background.white,
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllText: {
    ...getFontStyle(6, 'medium'),
    color: colors.text.secondary,
  },
  waitlistStatus: {
    ...getFontStyle(8, 'medium'),
  },
});

