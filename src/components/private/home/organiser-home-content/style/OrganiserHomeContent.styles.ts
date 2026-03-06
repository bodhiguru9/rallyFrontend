import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  greetingContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  greetingTextRegular: {
    ...getFontStyle(20, 'regular'),
    color: colors.text.primary,
  },
  greetingTextBold: {
    ...getFontStyle(20, 'semibold'),
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: 140, // Space for fixed bottom nav
  },
  illustrationContainer: {
    marginBottom: spacing.xl,
    width: 163,
    height: 163,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateImage: {
    width: 163,
    height: 163,
  },
  puzzleContainer: {
    width: 163,
    height: 163,
    position: 'relative',
  },
  puzzlePiece: {
    width: 81.5,
    height: 81.5,
    position: 'absolute',
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  puzzlePieceTopLeft: {
    top: 0,
    left: 0,
    borderColor: colors.primary,
    backgroundColor: colors.background.white,
  },
  puzzlePieceTopRight: {
    top: 0,
    right: 0,
    borderColor: 'transparent',
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.5)'),
  },
  puzzlePieceBottomLeft: {
    bottom: 0,
    left: 0,
    borderColor: 'transparent',
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.5)'),
  },
  puzzlePieceBottomRight: {
    bottom: 0,
    right: 0,
    borderColor: 'transparent',
    backgroundColor: withOpaqueForAndroid('rgba(255, 255, 255, 0.5)'),
  },
  puzzleContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  figure: {
    width: 12,
    height: 16,
    backgroundColor: '#FF9800',
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  calculator: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calcButton: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FF9800',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
    height: 32,
    justifyContent: 'center',
  },
  bar: {
    width: 10,
    borderRadius: 2,
  },
  barGreen: {
    height: 24,
    backgroundColor: '#4CAF50',
  },
  barPink: {
    height: 16,
    backgroundColor: '#E91E63',
  },
  barBlue: {
    height: 20,
    backgroundColor: '#2196F3',
  },
  emptyTitle: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...getFontStyle(14, 'regular'),
    color: '#656565',
    marginBottom: spacing.xl,
    textAlign: 'center',
    width: 301,
  },
  createButton: {
    width: 325,
    height: 36,
    borderRadius: 20,
    backgroundColor: withOpaqueForAndroid('rgba(61, 111, 146, 0.7)'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    ...getFontStyle(20, 'semibold'),
    color: colors.text.white,
  },
});
