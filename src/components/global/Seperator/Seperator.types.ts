import type { ViewStyle } from 'react-native';

export type SpacingSize = 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'xxl';

export interface SeperatorProps {
  /**
   * Spacing size using theme spacing tokens
   * @default 'base'
   */
  spacing?: SpacingSize;

  /**
   * Thickness of the separator line in pixels
   */
  thickness?: number;

  /**
   * Custom color for the separator
   * If not provided, uses theme border color
   */
  color?: string;

  /**
   * Additional custom styles
   */
  style?: ViewStyle;
}
