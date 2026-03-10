import type { StyleProp, ViewStyle } from 'react-native';

export type EventStatusBadgeVariant = 'going' | 'ongoing' | 'payment-pending';

export interface EventStatusBadgeProps {
  /**
   * The status variant: 'going' (green), 'ongoing' (red), or 'payment-pending' (amber)
   */
  variant: EventStatusBadgeVariant;
  style?: StyleProp<ViewStyle>;
}
