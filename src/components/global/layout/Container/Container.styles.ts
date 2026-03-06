import { StyleSheet } from 'react-native';
import { colors } from '@theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  containerWithGradient: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1000,
  },
  contentContainer: {
    flex: 1,
  },
});
