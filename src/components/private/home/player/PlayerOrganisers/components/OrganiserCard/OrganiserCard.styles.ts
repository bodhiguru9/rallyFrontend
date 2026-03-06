import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    minHeight: 200,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  featuredCard: {
    minHeight: 240,
    padding: spacing.lg,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: '#3B82F6', // Blue
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeYellow: {
    backgroundColor: '#FBBF24', // Yellow
  },
  badgeText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.white,
  },
  badgeTextYellow: {
    color: colors.text.primary,
  },
  mastersContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  flagsContainer: {
    flexDirection: 'row',
    gap: spacing.xs / 2,
    marginBottom: spacing.xs,
  },
  flag: {
    width: 20,
    height: 14,
    backgroundColor: colors.text.white,
    borderRadius: 2,
    opacity: 0.8,
  },
  mastersText: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.white,
    letterSpacing: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    minHeight: 60,
  },
  socialIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
    textTransform: 'uppercase',
  },
  content: {
    marginTop: 'auto',
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.white,
    marginBottom: spacing.xs / 2,
    textTransform: 'uppercase',
  },
  organizer: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.white,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
  },
  tag: {
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.3)'),
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  tagText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.white,
  },
  additionalTag: {
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.4)'),
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  additionalTagText: {
    ...getFontStyle(8, 'medium'),
    color: colors.text.white,
  },
});
