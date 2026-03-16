import type { FrequencySelection } from '../FrequencyModal';

export interface DateTimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dateTime: Date, frequency?: FrequencySelection) => void;
  initialDate?: Date;
  /** 24-hour format: hour 0-23 */
  initialStartTime?: { hour: number; minute: number };
  /** 24-hour format: hour 0-23 */
  initialEndTime?: { hour: number; minute: number };
  /** Form value: string[] e.g. ['weekly','mon','wed'] */
  initialFrequency?: string[];
}

/** 24-hour format: hour 0-23 */
export interface TimeSelection {
  hour: number;
  minute: number;
}
