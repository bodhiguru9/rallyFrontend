import { StyleSheet } from 'react-native';
import { spacing, getFontStyle , colors } from '@theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  title: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    paddingHorizontal: spacing.base,
  },
  scrollContent: {
    gap: spacing.md,
  },
  featuredContainer: {
    width: 280,
    marginRight: spacing.md,
  },
  cardContainer: {
    width: 160,
  },
});
