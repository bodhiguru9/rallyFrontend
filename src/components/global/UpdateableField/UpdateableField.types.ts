export interface UpdateableFieldProps {
  title: string;
  description?: string;
  value: string;
  onChangeText: (text: string) => void;
  onUpdate: () => void;
  onInputPress?: () => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  editable?: boolean;
}

