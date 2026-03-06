import { StyleSheet } from 'react-native';
import { borderRadius, colors, getFontStyle, spacing } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: '#64B5F6',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  saveButtonText: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  section: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  bankLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  listSection: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  listSectionTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
  cardRow: {
    marginBottom: spacing.sm,
  },
  cardLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.secondary,
    marginBottom: spacing.xxs,
  },
  cardValue: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.primary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.white,
    gap: spacing.md,
  },
  cardActionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  cardActionText: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
  cardActionDanger: {
    ...getFontStyle(12, 'medium'),
    color: colors.status.error,
  },
  addSectionTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  emptyListText: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
