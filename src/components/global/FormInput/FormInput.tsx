import React, { useState } from 'react';
import { TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import type { FormInputProps } from './FormInput.types';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';
import { Eye, EyeOff } from 'lucide-react-native';

export const FormInput: React.FC<FormInputProps> = ({
  label,
  labelSize,
  labelWeight,
  error,
  style,
  inputContainerStyle,
  leftIcon,
  rightIcon,
  isPassword = false,
  secureTextEntry,
  variant = 'glass',
  ...textInputProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const shouldShowToggle = isPassword || secureTextEntry;
  const effectiveSecureTextEntry = shouldShowToggle ? !isPasswordVisible : secureTextEntry;

  const renderRightIcon = () => {
    if (shouldShowToggle) {
      return (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconButton}>
          {isPasswordVisible ? (
            <EyeOff size={20} color={colors.text.tertiary} />
          ) : (
            <Eye size={20} color={colors.text.tertiary} />
          )}
        </TouchableOpacity>
      );
    }
    return rightIcon;
  };

  const effectiveRightIcon = renderRightIcon();

  const getInputContainerStyle = () => {
    if (variant === 'transparent') {
      return [styles.inputContainer, styles.inputContainerTransparent];
    }
    return [styles.inputContainer, styles.inputContainerGlass];
  };

  // For multiline inputs (like event descriptions), use system font to ensure emoji support
  const inputStyle = textInputProps.multiline
    ? [styles.input, { fontFamily: 'System' }, style]
    : [styles.input, style];

  return (
    <FlexView gap={4}>
      {label && <TextDs size={labelSize ?? 14} weight={labelWeight ?? 'medium'}>{label}</TextDs>}
      <FlexView style={[getInputContainerStyle(), inputContainerStyle]}>
        {leftIcon && <FlexView style={styles.leftIconContainer}>{leftIcon}</FlexView>}
        <TextInput
          style={inputStyle}
          placeholderTextColor={textInputProps.placeholderTextColor || colors.text.secondary}
          secureTextEntry={effectiveSecureTextEntry}
          {...textInputProps}
        />
        {effectiveRightIcon && <FlexView style={styles.rightIconContainer}>{effectiveRightIcon}</FlexView>}
      </FlexView>
      {error && <TextDs style={styles.errorText}>{error}</TextDs>}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    boxShadow: colors.glass.boxShadow.light,
    gap: spacing.sm,
    minHeight: 44,
  },
  inputContainerGlass: {
    backgroundColor: "#fffdef7e",
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    borderColor: colors.border.white,
  },
  inputContainerTransparent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  leftIconContainer: {
  },
  rightIconContainer: {
    position: 'absolute',
    right: spacing.base,
    zIndex: 1,
  },
  input: {
    ...getFontStyle(16, 'regular'),
    color: colors.text.primary,
    flex: 1,
    paddingRight: spacing.xl, // Add padding for eye icon
    paddingVertical: 0, // Remove default padding to match design
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xl + spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xl + spacing.sm,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    marginTop: spacing.xs,
  },
  iconButton: {
    padding: spacing.xs,
  },
});
