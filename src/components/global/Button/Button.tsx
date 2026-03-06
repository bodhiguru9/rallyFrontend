import React from 'react';
import { TextDs } from '@components';
import {TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import { colors, spacing, borderRadius, getFontStyle, opacity } from '@theme';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      opacity: disabled ? opacity.disabled : 1,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, ...styles.primaryButton };
      case 'secondary':
        return { ...baseStyle, ...styles.secondaryButton };
      case 'ghost':
        return { ...baseStyle, ...styles.ghostButton };
      default:
        return { ...baseStyle, ...styles.primaryButton };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'primary':
        return colors.text.white;
      case 'secondary':
      case 'ghost':
        return colors.primary;
      default:
        return colors.text.white;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} />
      ) : (
        <TextDs style={[styles.text, getTextStyle()]}>{title}</TextDs>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: colors.button.primary.background,
  },
  secondaryButton: {
    backgroundColor: colors.button.secondary.background,
    borderWidth: 1,
    borderColor: colors.button.secondary.border,
  },
  ghostButton: {
    backgroundColor: colors.button.ghost.background,
  },
  text: {
    ...getFontStyle(14, 'semibold'),
  },
  primaryText: {
    color: colors.button.primary.text,
  },
  secondaryText: {
    color: colors.button.secondary.text,
  },
  ghostText: {
    color: colors.button.ghost.text,
  },
});
