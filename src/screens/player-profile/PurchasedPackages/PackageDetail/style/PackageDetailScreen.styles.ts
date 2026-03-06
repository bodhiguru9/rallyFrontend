import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, typography } from '@theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    experimental_backgroundImage: colors.gradient.mainBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  packageCard: {
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginTop: spacing.md,
    marginBottom: spacing.base,
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerInfo: {
    flex: 1,
  },
  packageTitle: {
    ...getFontStyle(16, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  purchasedDate: {
    ...getFontStyle(12, 'regular'),
    color: colors.text.secondary,
  },
  usageSection: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  usageContent: {
    // backgroundColor: colors.background.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
  },
  usageInfo: {
    marginBottom: spacing.md,
  },
  usageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usageText: {
    ...getFontStyle(20, 'bold'),
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  progressBar: {
    marginTop: spacing.xs,
  },
  expiresText: {
    ...getFontStyle(12, 'regular'),
    color: colors.primary,
  },
  eventsSection: {
    marginBottom: spacing.xl,
  },
  eventsList: {
    paddingBottom: spacing.base,
  },
  eventCardWrapper: {
    marginBottom: spacing.base,
  },
});
