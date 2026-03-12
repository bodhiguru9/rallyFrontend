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
    paddingTop: spacing.xl
  },
  headerCard: {
    borderRadius: borderRadius.xxl,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
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
  filtersRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  filtersRowInner: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.base,
  },
  cardsList: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dateFilterWrapper: {
    marginHorizontal: -spacing.base,
    marginBottom: spacing.lg,
  },
  periodOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    paddingTop: spacing.xxxl,
    paddingRight: spacing.base,
  },
  periodMenu: {
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.95)'),
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  periodItem: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  periodItemActive: {
    backgroundColor: withOpaqueForAndroid('rgba(61, 111, 146, 0.12)'),
  },
});
