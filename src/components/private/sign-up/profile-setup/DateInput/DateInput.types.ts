export interface IDateInputProps {
  label: string;
  placeholder: string;
  value?: Date;
  onChange: (date: Date) => void;
  containerStyle?: object;
  error?: string;
  mode?: 'date' | 'time' | 'datetime';
  format?: 'MM/YYYY' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
}
