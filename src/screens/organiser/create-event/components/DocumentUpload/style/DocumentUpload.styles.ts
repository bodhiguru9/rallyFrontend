import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    width: '48%',
    alignItems: 'stretch',
  },
  placeholder: {
    width: '100%',
    aspectRatio: 1.6,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.status.error,
    borderRadius: borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

