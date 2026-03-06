import React, { useRef, useState, useEffect } from 'react';
import { FlexView } from '@designSystem/atoms/FlexView';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { colors, spacing, borderRadius, getFontStyle } from '@theme';

interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (code: string) => void;
  onFocus?: () => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChangeText,
  onComplete,
  onFocus,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const lastCompletedCodeRef = useRef<string>('');

  useEffect(() => {
    // Sync external value with internal state
    const currentValue = otp.join('');
    if (value !== currentValue) {
      const newOtp = value.split('').slice(0, length);
      const paddedOtp = [...newOtp, ...Array(length - newOtp.length).fill('')];
      setOtp(paddedOtp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]);

  useEffect(() => {
    // Trigger onComplete when all fields are filled
    const code = otp.join('');
    if (code.length === length && onComplete && code !== lastCompletedCodeRef.current) {
      lastCompletedCodeRef.current = code;
      onComplete(code);
    }
    // Reset ref if code is incomplete (user deleted a digit)
    if (code.length < length) {
      lastCompletedCodeRef.current = '';
    }
  }, [otp, length, onComplete]);

  const handleChangeText = (text: string, index: number) => {
    // Extract all digits from the input (handles paste events)
    const digits = text.replace(/[^0-9]/g, '');

    // If multiple digits are pasted, distribute them across fields
    if (digits.length > 1) {
      const newOtp = [...otp];
      // Fill digits starting from current index
      for (let i = 0; i < digits.length && index + i < length; i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);

      const newValue = newOtp.join('');
      onChangeText(newValue);

      // Focus the last filled input or the next empty one
      const lastFilledIndex = Math.min(index + digits.length - 1, length - 1);
      const nextIndex = Math.min(lastFilledIndex + 1, length - 1);
      if (nextIndex < length && !newOtp[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      } else {
        // Blur if all fields are filled
        inputRefs.current[lastFilledIndex]?.blur();
      }
    } else {
      // Single digit input (normal typing)
      const digit = digits.slice(0, 1);
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      const newValue = newOtp.join('');
      onChangeText(newValue);

      // Auto-focus next input
      if (digit && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Trigger parent onFocus callback on first focus
    if (onFocus) {
      onFocus();
    }
    // Select all text when focused
    inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } });
  };

  return (
    <FlexView style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref;
          }}
          style={[styles.input, digit && styles.inputFilled]}
          value={digit}
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          keyboardType="number-pad"
          maxLength={length}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  input: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.glass.background.white,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...getFontStyle(20, 'bold'),
    color: colors.text.primary,
  },
  inputFilled: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});

