import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  color?: string;
  icon?: string; // <-- Add this line
  customLabel?: ReactNode;
}

export type DropdownPosition = 'top' | 'bottom' | 'left' | 'right';

interface DropdownPropsBase {
  /** Label displayed above the dropdown */
  label?: string;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Array of dropdown options */
  options: DropdownOption[];
  /** Position of the dropdown menu relative to trigger */
  position?: DropdownPosition;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Custom container style */
  containerStyle?: ViewStyle;
  /** Custom dropdown menu style */
  dropdownStyle?: ViewStyle;
  /** Custom option style */
  optionStyle?: ViewStyle;
  /** Custom selected option style */
  selectedOptionStyle?: ViewStyle;
  /** Custom label style */
  labelStyle?: TextStyle;
  /** Custom trigger button style */
  triggerStyle?: ViewStyle;
  /** Custom trigger text style */
  triggerTextStyle?: TextStyle;
  /** Custom icon component for the right side (chevron) */
  icon?: ReactNode;
  /** Left icon displayed before the trigger text */
  leftIcon?: ReactNode;
  /** Maximum height of dropdown menu */
  maxHeight?: number;
  /** Show search input */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

export interface DropdownPropsSingle extends DropdownPropsBase {
  /** Multi-select mode: when true, value is string[] and options can be toggled */
  multiSelect?: false;
  /** Currently selected value (single) */
  value?: string;
  /** Callback when an option is selected */
  onSelect: (value: string) => void;
}

export interface DropdownPropsMulti extends DropdownPropsBase {
  multiSelect: true;
  /** Currently selected values */
  value?: string[];
  /** Callback when selection changes */
  onSelect: (values: string[]) => void;
  /** Maximum number of selections (only when multiSelect is true) */
  maxSelections?: number;
}

export type DropdownProps = DropdownPropsSingle | DropdownPropsMulti;
