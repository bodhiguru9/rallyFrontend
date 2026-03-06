import type { ViewStyle } from 'react-native';

export interface SelectOption {
  label: string;
  value: string;
}

export interface MultiSelectInputProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string[];
  onSelect: (values: string[]) => void;
  containerStyle?: ViewStyle;
  error?: string;
  maxSelections?: number;
}
