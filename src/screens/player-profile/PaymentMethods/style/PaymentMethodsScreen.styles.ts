import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

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
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  saveButtonText: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.white,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.medium,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.base,
  },
  cardsContainer: {
    marginBottom: spacing.base,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'transparent',
    boxShadow: colors.glass.boxShadow.light,
    gap: spacing.sm,
    width: 100,
    height: 30,
  },
  addCardText: {
    ...getFontStyle(12, 'medium'),
    color: colors.primary,
  },
});
