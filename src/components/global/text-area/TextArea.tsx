import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';
import type { TextAreaProps } from './TextArea.types';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  containerStyle,
  style,
  minHeight = 120,
  maxLength,
  showCharCount = false,
  value,
  ...textInputProps
}) => {
  const charCount = value?.length || 0;

  return (
    <FlexView gap={spacing.sm} style={containerStyle}>
      {label && <TextDs size={14} weight="semibold">{label}</TextDs>}
      <TextInput
        style={[styles.input, { minHeight }, error && styles.inputError, style]}
        placeholderTextColor={colors.text.tertiary}
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
        value={value}
        {...textInputProps}
      />
      {(error || (showCharCount && maxLength)) && (
        <FlexView style={styles.footerRow}>
          {error && <TextDs style={styles.errorText}>{error}</TextDs>}
          {showCharCount && maxLength && (
            <TextDs style={styles.charCount}>
              {charCount}/{maxLength}
            </TextDs>
          )}
        </FlexView>
      )}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.glass.background.white,
    boxShadow: colors.glass.boxShadow.light,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...getFontStyle(12, 'regular'),
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.glass.background.white,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  errorText: {
    ...getFontStyle(8, 'regular'),
    color: colors.status.error,
    flex: 1,
  },
  charCount: {
    ...getFontStyle(8, 'regular'),
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
});
