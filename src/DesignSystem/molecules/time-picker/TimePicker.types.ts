export interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  containerStyle?: object;
  disabled?: boolean;
  /** When true, hour is 0-23 and AM/PM column is hidden */
  use24Hour?: boolean;
  /** Minute interval for the picker (e.g. 15 for 00, 15, 30, 45). Defaults to 15. */
  minuteInterval?: 15 | 10;
}

export interface TimeValue {
  /** 1-12 when use24Hour is false, 0-23 when use24Hour is true */
  hour: number;
  minute: number; // 0-59 or 0, 15, 30, 45 for 15-minute increments
  period: 'AM' | 'PM'; // ignored when use24Hour is true
}
