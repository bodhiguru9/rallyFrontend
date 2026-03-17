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
    gap: spacing.base,
  },
  inputContainer: {
    marginBottom: spacing.xs,
  },
  emiratesSection: {
    marginTop: spacing.sm,
  },
  emiratesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  emiratesTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
  },
  emiratesUpdateButton: {
    backgroundColor: '#F5f5f5',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emiratesUpdateButtonText: {
    ...getFontStyle(12, 'semibold'),
    color: 'blueGray',
  },
  emiratesRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  sectionTitle: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  sportLabel: {
    ...getFontStyle(12, 'medium'),
    color: colors.text.primary,
  },
  removePill: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  removePillText: {
    ...getFontStyle(8, 'medium'),
    color: '#FF4444',
  },
});
