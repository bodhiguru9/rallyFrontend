import type { User } from '@app-types';

export interface UserProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
}
