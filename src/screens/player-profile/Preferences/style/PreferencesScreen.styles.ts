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
    borderRadius: borderRadius.md,
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
  card: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    padding: 0,
    marginTop: spacing.md,
  },
  section: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  generalSection: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  preferenceLabel: {
    ...getFontStyle(14, 'semibold'),
    color: colors.text.primary,
    flex: 0.4,
  },
  selectWrapper: {
    flex: 0.6,
  },
  selectContainer: {
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'white'
  },
  selectInput: {
    backgroundColor: 'white',
    height: 44,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  selectText: {
    textAlign: 'right',
    fontSize: 12,
  },
  toggleContainer: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  lastToggleContainer: {
    paddingVertical: spacing.md,
    borderBottomWidth: 0,
  },
});
