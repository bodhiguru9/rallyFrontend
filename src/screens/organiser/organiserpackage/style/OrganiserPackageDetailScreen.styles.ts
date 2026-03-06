import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing, withOpaqueForAndroid } from '@theme';

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
  headerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  segmented: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  descriptionText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  priceText: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  eventsText: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.secondary,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#E8F5E9',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: withOpaqueForAndroid('rgba(231, 76, 60, 0.18)'),
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    ...getFontStyle(12, 'semibold'),
    color: colors.status.error,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#5B8FB8',
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
  editBlock: {
    gap: spacing.md,
  },
  priceEditRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  priceCol: {
    flex: 1,
  },
  eventsCol: {
    flex: 1,
  },
});
