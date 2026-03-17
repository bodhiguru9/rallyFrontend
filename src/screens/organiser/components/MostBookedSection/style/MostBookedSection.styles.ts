import { StyleSheet } from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border.white,
    paddingVertical: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    marginTop: spacing.lg,
    paddingRight: spacing.base,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: spacing.md,
    width: 70,
  },
  avatarContainer: {
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.secondary,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    ...getFontStyle(12, 'semibold'),
    color: colors.text.primary,
    textAlign: 'center',
  },
});
