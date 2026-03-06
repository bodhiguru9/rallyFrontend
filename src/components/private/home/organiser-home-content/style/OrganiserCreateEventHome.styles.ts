import { StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle, borderRadius } from '@theme';

export const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
  },
  cardList: {
    gap: spacing.md,
  },
  cardWrapper: {
    marginRight: spacing.md,
    width: 350,
  },
  emptyCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.white,
    padding: spacing.base,
    alignItems: 'center',
  },
  emptyText: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
});
