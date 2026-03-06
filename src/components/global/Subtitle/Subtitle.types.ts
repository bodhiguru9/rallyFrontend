import type { TextStyle } from 'react-native';

export type SubtitleVariant = 'default' | 'small' | 'large' | 'tertiary';

export interface SubtitleProps {
  variant?: SubtitleVariant;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  textAlign?: 'left' | 'center' | 'right';
}
