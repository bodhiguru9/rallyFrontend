import { StyleSheet } from 'react-native';
import { spacing, colors } from '@theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    elevation: 8,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    gap: 10,
    // Custom shadow
    boxShadow: colors.boxShadow.blue,
    elevation: 8,
    backgroundColor: colors.primaryDark,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 50,
  },
  navButtonActive: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 50,
    borderRadius: 25,
    experimental_backgroundImage:
      'linear-gradient(143deg, rgba(221, 245, 244, 0.70) 7.42%, rgba(233, 251, 232, 0.70) 96.7%)',
    boxShadow: colors.boxShadow.lowRaised,
  },
});
