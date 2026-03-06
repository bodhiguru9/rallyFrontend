import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  inputText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
    flex: 1,
  },
  placeholder: {
    color: colors.text.tertiary,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
});

