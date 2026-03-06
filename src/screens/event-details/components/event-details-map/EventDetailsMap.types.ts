import type { ViewStyle } from 'react-native';

export interface EventDetailsMapProps {
  /** Optional container style override */
  style?: ViewStyle;
  /** Optional numeric coordinates to center the map */
  latitude?: number;
  longitude?: number;
  /** Optional address string (e.g. eventLocation). Used when coordinates are not available. */
  address?: string;
}
