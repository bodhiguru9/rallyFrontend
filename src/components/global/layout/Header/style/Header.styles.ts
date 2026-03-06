import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, withOpaqueForAndroid } from '@theme';

export const styles = StyleSheet.create({
  logoText: {
    color: colors.text.primary,
    ...getFontStyle(14, 'bold'),
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: spacing.xs,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    minWidth: 150,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dropdownItemActive: {
    backgroundColor: withOpaqueForAndroid('rgba(61, 111, 146, 0.1)'),
  },
  dropdownItemText: {
    color: colors.text.primary,
    ...getFontStyle(16, 'medium'),
  },
  dropdownItemTextActive: {
    color: colors.primary,
    ...getFontStyle(16, 'bold'),
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: '100%',
  },
  searchButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  notificationButton: {
    padding: spacing.sm,
    position: 'relative',
  },
  customIcon: {
    width: 24,
    height: 24,
    objectFit: 'contain',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.primaryDark,
    boxShadow: colors.glass.boxShadow.light,
    borderRadius: borderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.text.white,
    ...getFontStyle(6, 'bold'),
  },
  signUpButton: {
    backgroundColor: colors.glass.background.white,
    boxShadow: colors.glass.boxShadow.white,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.base,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: colors.text.blueGray,
    ...getFontStyle(14, 'medium'),
  },
});
