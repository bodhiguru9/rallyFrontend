import { borderRadius, colors, getFontStyle, spacing } from '@theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContainer: {
    marginTop: 60,
    marginRight: spacing.base,
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
    padding: spacing.xs,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.base,
  },
  userInfo: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
    textAlign: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  phoneNumber: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  email: {
    ...getFontStyle(14, 'regular'),
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.base,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.base,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
  },
  logoutText: {
    ...getFontStyle(14, 'medium'),
    color: colors.status.error,
  },
});
