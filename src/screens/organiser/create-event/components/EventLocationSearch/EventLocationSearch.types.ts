import type { ReactNode } from 'react';
import type { EventLocation } from '@app-types/location.types';

export interface EventLocationSearchProps {
  /** Currently selected location (null when none). */
  value: EventLocation | null;
  /** Called when user selects a location or clears selection. */
  onChange: (location: EventLocation | null) => void;
  placeholder?: string;
  leftIcon?: ReactNode;
  /** Min characters before triggering search (default 3). */
  minSearchLength?: number;
  /** Debounce delay in ms (default 500). */
  debounceMs?: number;
  /** Optional container style. */
  containerStyle?: object;
  /** Called when dropdown opens or closes. Use to disable parent ScrollView when open. */
  onDropdownVisibilityChange?: (visible: boolean) => void;
}
