import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, shadows } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  searchContainer: {
    marginBottom: spacing.xl,
  },
  recommendedSection: {
    marginBottom: spacing.xl,
  },
  recommendedTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  recommendedImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  recommendedImage: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
  },
  recommendedImageContent: {
    width: '100%',
    height: '100%',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  uploadButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
    marginLeft: spacing.sm,
  },
  uploadIcon: {
    marginRight: spacing.xs,
  },
  ratioHint: {
    backgroundColor: '#FFF9E6',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  ratioHintText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

