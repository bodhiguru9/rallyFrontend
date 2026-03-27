export interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called after delete account API succeeds (e.g. navigate to SignIn). */
  onDeleteSuccess?: () => void;
}
