import type { TextStyle } from 'react-native';

export type TitleVariant = 'pageTitle' | 'cardTitle' | 'headerTitle' | 'mapText';

export interface TitleProps {
  variant: TitleVariant;
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
  textAlign?: 'left' | 'center' | 'right';
}
