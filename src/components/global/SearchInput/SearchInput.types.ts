import type { TextInputProps } from 'react-native';

export interface SearchInputProps extends Omit<TextInputProps, 'style'> {
  containerStyle?: object;
  style?: object;
}

