export interface ToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  containerStyle?: object;
  activeColor?: string;
  inactiveColor?: string;
}

