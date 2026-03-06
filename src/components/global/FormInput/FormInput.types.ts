import { ReactNode } from 'react';
import type { TextInputProps, ViewStyle } from 'react-native';
import type { TextSize } from '@designSystem/atoms/TextDs';

export type FormInputVariant = 'glass' | 'transparent';

export type FormInputLabelWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';

export interface FormInputProps extends TextInputProps {
  label?: string;
  labelSize?: TextSize;
  labelWeight?: FormInputLabelWeight;
  labelVarient?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isPassword?: boolean;
  variant?: FormInputVariant;
}
