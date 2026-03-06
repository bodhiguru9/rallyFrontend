export interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  containerStyle?: object;
  disabled?: boolean;
  /** When true, hour is 0-23 and AM/PM column is hidden */
  use24Hour?: boolean;
}

export interface TimeValue {
  /** 1-12 when use24Hour is false, 0-23 when use24Hour is true */
  hour: number;
  minute: number; // 0-59 or 0, 15, 30, 45 for 15-minute increments
  period: 'AM' | 'PM'; // ignored when use24Hour is true
}
