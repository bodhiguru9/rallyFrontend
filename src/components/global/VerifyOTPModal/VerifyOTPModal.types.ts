export interface VerifyOTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (otpCode: string) => void;
  onResend: () => void;
  phoneNumber?: string;
}

