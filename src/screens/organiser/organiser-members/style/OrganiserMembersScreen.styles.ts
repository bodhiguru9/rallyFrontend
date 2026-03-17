import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  headerCard: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  filtersRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  cardsList: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.glass.background.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  periodOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: spacing.xxxl,
    paddingRight: spacing.base,
  },
  periodMenu: {
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.9)'),
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    minWidth: 180,
  },
  periodItem: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  periodItemActive: {
    backgroundColor: withOpaqueForAndroid('rgba(61, 111, 146, 0.12)'),
  },
  memberCard: {
    backgroundColor: "#fffdefbc",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  priceIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
