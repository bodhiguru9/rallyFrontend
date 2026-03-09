import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#E0F7F5', // Light blue-green background
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.medium,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.base,
  },
  header: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  title: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    paddingTop: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.base,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.border.medium,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.xl,
    marginTop: spacing.base,
  },
  addButtonActive: {
    backgroundColor: colors.primary,
  },
  addButtonText: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.white,
  },
  addButtonTextDisabled: {
    color: colors.text.tertiary,
  },
});

