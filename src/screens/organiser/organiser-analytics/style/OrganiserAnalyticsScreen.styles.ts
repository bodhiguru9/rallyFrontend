import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  headerSpacer: {
    width: 32,
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
    paddingTop: spacing.xl
  },
  revenueCard: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  periodButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.6)'),
    borderWidth: 1,
    borderColor: colors.border.white,
  },
  periodOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: withOpaqueForAndroid('rgba(0, 0, 0, 0.25)'),
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
  filtersRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  cardsList: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
