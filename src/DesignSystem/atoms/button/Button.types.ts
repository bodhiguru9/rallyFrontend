import type { ViewStyle } from 'react-native';

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'footer';

  // Style overrides (FlexView-style)
  backgroundColor?: string;
  bg?: string;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  rounded?: boolean;
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  minWidth?: ViewStyle['minWidth'];
  maxWidth?: ViewStyle['maxWidth'];
  minHeight?: ViewStyle['minHeight'];
  maxHeight?: ViewStyle['maxHeight'];

  style?: ViewStyle;
}
