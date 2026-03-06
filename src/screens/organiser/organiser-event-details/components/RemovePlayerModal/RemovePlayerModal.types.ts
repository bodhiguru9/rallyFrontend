export interface RemovePlayerModalProps {
  visible: boolean;
  playerName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
