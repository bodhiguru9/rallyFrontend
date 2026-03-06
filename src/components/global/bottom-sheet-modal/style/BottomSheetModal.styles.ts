import { StyleSheet } from 'react-native';
import { colors, borderRadius } from '@theme';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surface.overlay,
  },
  keyboardAvoid: {
    width: '100%',
  },
  container: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleIndicator: {
    backgroundColor: colors.text.tertiary,
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
  },
  contentContainer: {
    flex: 1,
  },
});
