export interface PasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (currentPassword: string, newPassword: string) => void;
  onForgotPassword: () => void;
}

