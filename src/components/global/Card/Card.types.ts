import type { ViewProps, ViewStyle } from 'react-native';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
