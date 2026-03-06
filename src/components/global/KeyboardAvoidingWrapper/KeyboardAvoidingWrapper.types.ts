export interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  style?: import('react-native').ViewStyle;
  behavior?: 'padding' | 'height' | 'position';
  keyboardVerticalOffset?: number;
  enabled?: boolean;
  scrollable?: boolean;
}

