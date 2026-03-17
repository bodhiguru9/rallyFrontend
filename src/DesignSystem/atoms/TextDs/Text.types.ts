import type { TextStyle, StyleProp } from 'react-native';
import type { colors, typography } from '@theme';

// Extract color types from theme
type ThemeColors = typeof colors;
type TextColors = keyof ThemeColors['text'];
type StatusColors = keyof ThemeColors['status'];
type PrimaryColors = 'primary' | 'secondary' | 'accent';

// All possible color values
export type TextColor = TextColors | StatusColors | PrimaryColors | string | 'white' | 'black' | '#3D6F92';

// Numeric font size keys from theme (6, 8, 10, 12, 14, 16, 20)
export type TextSize = keyof typeof typography.fontSize;

// Font weight keys from theme
export type TextWeight = keyof typeof typography.fontWeight;

export interface TextProps {
  /**
   * Font size - numeric key from theme (6, 8, 10, 12, 14, 16, 20)
   * @default 14
   */
  size?: TextSize;

  /**
   * Font weight - theme weight key
   * @default 'regular'
   */
  weight?: TextWeight;

  /**
   * Text color - theme color key or direct value
   * @default 'primary'
   */
  color?: TextColor;

  /**
   * Text content
   */
  children: React.ReactNode;

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';

  /**
   * Line height key from theme
   */
  lineHeight?: keyof typeof typography.lineHeight;

  /**
   * Number of lines before truncating
   */
  numberOfLines?: number;

  /**
   * Margin top (convenience prop)
   */
  marginTop?: number;

  /**
   * Additional styles
   */
  style?: StyleProp<TextStyle>;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Test ID
   */
  testID?: string;
}
