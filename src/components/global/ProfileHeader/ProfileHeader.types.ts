export interface Sport {
  name: string;
  icon?: string;
}

export interface ProfileHeaderProps {
  imageUri: string | null;
  initials: string;
  name: string;
  sports: Sport[];
  onEditProfile: () => void;
  onQRCodePress?: () => void;
}

