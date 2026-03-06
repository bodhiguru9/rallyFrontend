import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  search: {
    flex: 1,
  },
  planSelect: {
    width: 140,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
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
    backgroundColor: withOpaqueForAndroid('rgba(91, 143, 184, 0.18)'),
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.primary,
  },
  usage: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
});

