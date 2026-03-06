import { colors, getFontStyle } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  initials: {
    color: colors.text.white,
    ...getFontStyle(14, 'semibold'),
    textTransform: 'uppercase',
  },
});
