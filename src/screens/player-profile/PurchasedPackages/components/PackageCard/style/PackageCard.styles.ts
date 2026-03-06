import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerInfo: {
    flex: 1,
  },
  packageTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  organizerName: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  detailsSection: {
    marginTop: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailTitle: {
    ...getFontStyle(12, 'bold'),
    color: colors.text.primary,
  },
  validity: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  sportTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E7', // Light orange background
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  sportText: {
    ...getFontStyle(8, 'medium'),
    color: '#FF6B35', // Orange text
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 0,
    marginBottom: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  infoItem: {
    flex: 0.2,
    alignItems: 'flex-start',
  },
  infoLabel: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  infoValue: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    ...getFontStyle(16, 'bold'),
    color: colors.primary,
  },
});

