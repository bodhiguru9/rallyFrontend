import type { LucideIcon } from 'lucide-react-native';
import { ImageKey } from '@assets/images';
export type IconTagVariant = 'orange' | 'teal' | 'purple' | 'yellow' | 'indigo' | 'green';

export type IconTagSize = 'xxSmall' | 'extraSmall' | 'small' | 'medium' | 'large';

export type IconTagSearchType = 'sport' | 'eventType';

export interface IconTagSearchPayload {
  searchType: IconTagSearchType;
  value: string;
}

export interface IconTagProps {
  /**
   * The title text to display
   */
  title: string;

  /**
   * The Lucide icon component to display
   */
  icon?: LucideIcon| ImageKey;

  /**
   * The color variant for the tag
   * @default 'orange'
   */
  variant?: IconTagVariant;

  /**
   * The size of the tag
   * @default 'medium'
   */
  size?: IconTagSize;

  /**
   * Optional search type for tag search navigation (e.g. 'sport' | 'eventType').
   * When set with onPress, the payload passed to onPress includes this searchType.
   */
  searchType?: IconTagSearchType;

  /**
   * Optional value for the search payload. Defaults to title when not provided.
   * Used with searchType and onPress when navigating to tag search.
   */
  value?: string;

  /**
   * Called when the tag is pressed. If searchType is set, receives
   * { searchType, value: value ?? title } so the parent can navigate to TagSearch.
   */
  onPress?: (payload: IconTagSearchPayload) => void;
}
