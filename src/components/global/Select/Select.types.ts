export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  placeholder: string;
  options: SelectOption[];
  value?: string;
  onSelect?: (value: string) => void;
  onValueChange?: React.Dispatch<React.SetStateAction<string>>;
  containerStyle?: object;
  error?: string;
  autoOpen?: boolean;
  onModalClose?: () => void;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  inputStyle?: object;
  textStyle?: object;
  searchable?: boolean;
  searchPlaceholder?: string;
}
