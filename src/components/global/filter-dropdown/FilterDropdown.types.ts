export interface FilterDropdownOption {
  id: string;
  label: string;
  value: string;
  icon?: string; // Optional icon identifier (e.g., ImageKey from images)
}

export interface FilterDropdownProps {
  label: string;
  options: FilterDropdownOption[];
  selectedIds: string[];
  align?: 'left' | 'right';
  isMultiSelect?: boolean; // If false, only one option can be selected at a time
  alwaysShowLabel?: boolean; // Keep button headline fixed to `label` even when an item is selected
  onToggle: (id: string) => void;
  /** When dropdown opens/closes. Parent should set ScrollView scrollEnabled={!open} so the list scrolls on Android. */
  onOpenChange?: (open: boolean) => void;
  /** Optional Lucide icon component to render before the label */
  buttonIcon?: React.ComponentType<{ size?: number; color?: string }>;
}
