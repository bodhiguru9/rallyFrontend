import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: colors.background.white,
  },
  avatar: {
    width: 44,
    height: 44,
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withOpaqueForAndroid('rgba(91, 143, 184, 0.18)'),
  },
  playerInfo: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.primary,
  },
  playerSub: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  usageWrap: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  usageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  usageTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  usageTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  usageCount: {
    ...getFontStyle(14, 'bold'),
    color: colors.primary,
  },
  expiresText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  progressBar: {
    marginTop: spacing.xs,
  },
  eventsList: {
    gap: spacing.md,
  },
  eventCardWrap: {
    width: '100%',
  },
});
