import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconLabelText: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.secondary,
  },
  sliderContainer: {
    height: 50,
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 13,
    overflow: 'visible',
  },
  trackBackground: {
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.xs,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 23,
    // Increase touch area
    paddingVertical: 15,
    marginVertical: -15,
  },
  trackActive: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xs,
    position: 'absolute',
    top: 23,
  },
  handle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  handleActive: {
    borderColor: colors.primaryDark,
    transform: [{ scale: 1.1 }],
  },
  handleValue: {
    ...getFontStyle(8, 'bold'),
    color: colors.primary,
    marginTop: -2,
  },
});
