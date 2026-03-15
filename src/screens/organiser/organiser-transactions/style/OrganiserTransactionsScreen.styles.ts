import { StyleSheet } from 'react-native';
import { colors, spacing } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  title: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  filtersRow: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    flexWrap: 'wrap',
  },
  dateFilterSection: {
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
});
