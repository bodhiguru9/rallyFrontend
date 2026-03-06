export interface WaitlistActionModalProps {
  visible: boolean;
  playerName: string;
  playerProfilePic: string | null;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}
