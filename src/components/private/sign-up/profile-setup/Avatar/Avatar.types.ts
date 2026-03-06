import { avatarSize } from '@theme';

export interface IAvatarProps {
  imageUri?: string | null;
  initials?: string;
  size?: keyof typeof avatarSize;
  onPress?: () => void;
}
