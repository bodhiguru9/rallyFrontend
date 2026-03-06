export interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

export interface UpdateNumberModalProps {
  visible: boolean;
  onClose: () => void;
  onSendOTP: (phoneNumber: string) => void;
  initialValue?: string;
}

