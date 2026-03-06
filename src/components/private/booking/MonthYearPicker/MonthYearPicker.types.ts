export interface IMonthYearPickerProps {
  visible: boolean;
  value?: { month: number; year: number };
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}
