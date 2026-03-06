import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  orText: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    ...getFontStyle(14, 'regular'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.buttonBackground,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: colors.boxShadow.lowRaised,
  },
  bottonIcon: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
});
