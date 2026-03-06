import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius as borderRadiusTokens, opacity, borderRadius } from '@theme';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  backgroundColor,
  bg,
  borderWidth,
  borderColor,
  borderRadius,
  rounded,
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
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
      case 'footer':
        return {
          ...baseStyle,
          ...styles.footerButton,
          backgroundColor: 'transparent',
        };
      default:
        return { ...baseStyle, ...styles.primaryButton };
    }
  };

  const dynamicStyle: ViewStyle = {
    ...(backgroundColor !== undefined && { backgroundColor }),
    ...(bg !== undefined && { backgroundColor: bg }),
    ...(borderWidth !== undefined && { borderWidth }),
    ...(borderColor !== undefined && { borderColor }),
    ...(rounded && { borderRadius: borderRadiusTokens.full }),
    ...(!rounded && borderRadius !== undefined && { borderRadius }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(minWidth !== undefined && { minWidth }),
    ...(maxWidth !== undefined && { maxWidth }),
    ...(minHeight !== undefined && { minHeight }),
    ...(maxHeight !== undefined && { maxHeight }),
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'primary':
        return colors.button.primary.text;
      case 'secondary':
      case 'ghost':
        return colors.button.secondary.text;
      default:
        return colors.button.primary.text;
    }
  };

  const content =
    loading ? (
      <ActivityIndicator color={getLoaderColor()} />
    ) : (
      children
    );

  const isFooterVariant = variant === 'footer';

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        dynamicStyle,
        isFooterVariant && styles.footerOverflow,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {isFooterVariant ? (
        <>
          {Platform.OS === 'android' ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.primaryDark }]} />
          ) : (
            <BlurView
              intensity={50}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.footerContent}>{content}</View>
        </>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadiusTokens.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
  footerButton: {
    backgroundColor: colors.primaryDark,
    boxShadow: colors.boxShadow.blue,
    borderRadius: borderRadius.full,
    width: "100%",
    paddingVertical: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerOverflow: {
    overflow: 'hidden',
  },
  footerContent: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
