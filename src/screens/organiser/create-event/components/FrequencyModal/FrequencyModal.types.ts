export interface FrequencyModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (frequency: FrequencySelection) => void;
  initialFrequency?: FrequencySelection;
}

export type FrequencyType = 'never' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface FrequencySelection {
  type: FrequencyType;
  /** For weekly: 0=Sun, 1=Mon, ..., 6=Sat */
  weeklyDays?: number[];
  /** 'never' or specific end date */
  ends: 'never' | { on: Date };
  /** For custom: user-defined recurrence description */
  customValue?: string;
}
