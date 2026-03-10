import { StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '@theme';

export const styles = StyleSheet.create({
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  verticalTextContainer: {
    position: 'absolute',
    bottom: spacing.base,
    left: '50%',
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 15,
  },
  badgeOverride: {
    position: 'relative',
    bottom: 0,
    left: 0,
    transform: [{ rotate: '-90deg' }],
  },
  verticalDateText: {
    transform: [{ rotate: '-90deg' }],
    width: 80,
    textAlign: 'center',
  },
});
