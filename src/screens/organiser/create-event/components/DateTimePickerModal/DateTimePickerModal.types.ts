export interface DateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dateTime: Date, frequency?: string) => void;
  initialDate?: Date;
  /** 24-hour format: hour 0-23 */
  initialStartTime?: { hour: number; minute: number };
  /** 24-hour format: hour 0-23 */
  initialEndTime?: { hour: number; minute: number };
  initialFrequency?: string;
}

/** 24-hour format: hour 0-23 */
export interface TimeSelection {
  hour: number;
  minute: number;
}

export interface FrequencyOption {
  label: string;
  value: string;
}
