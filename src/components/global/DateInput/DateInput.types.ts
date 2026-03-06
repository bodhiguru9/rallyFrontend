export interface DateInputProps {
  label?: string;
  placeholder: string;
  value?: Date;
  onChange: (date: Date) => void;
  containerStyle?: object;
  error?: string;
  format?: 'MM/YYYY' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  leftIcon?: React.ReactNode;
  maximumDate?: Date;
  minimumDate?: Date;
  allowFutureDates?: boolean;
}
