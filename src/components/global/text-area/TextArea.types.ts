import type { TextInputProps, ViewStyle, TextStyle } from 'react-native';

export interface TextAreaProps extends Omit<TextInputProps, 'multiline'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  style?: TextStyle;
  minHeight?: number;
  maxLength?: number;
  showCharCount?: boolean;
}
