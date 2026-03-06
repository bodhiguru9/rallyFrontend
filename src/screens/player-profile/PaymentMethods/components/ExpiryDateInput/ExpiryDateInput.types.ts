export interface ExpiryDateInputProps {
  label: string;
  value?: { month: number; year: number };
  onSelect: (month: number, year: number) => void;
  containerStyle?: object;
  error?: string;
}

