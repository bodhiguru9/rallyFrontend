import { StyleSheet } from 'react-native';
import { spacing, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#5B9A9D',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: withOpaqueForAndroid('rgba(91, 154, 157, 0.7)'),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  aiBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4EC9C4',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
