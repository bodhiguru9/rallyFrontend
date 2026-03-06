import { colors, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.background.tertiary,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
  },
  initials: {
    color: colors.text.secondary,
    ...getFontStyle(14, 'semibold'),
    textTransform: 'uppercase',
    textAlign: 'center',
    maxWidth: '100%',
  },
});
