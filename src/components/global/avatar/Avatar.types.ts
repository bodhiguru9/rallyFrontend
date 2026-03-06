import { avatarSize } from '@theme';

export type AvatarSizeKey = keyof typeof avatarSize;

export interface AvatarProps {
  /** Profile image URL. When null/undefined/empty, initials are shown instead. */
  imageUri?: string | null;
  /** Full name used to derive initials when imageUri is not set. */
  fullName?: string;
  /** Optional override for initials (e.g. when fullName is not available). */
  initials?: string;
  size?: AvatarSizeKey;
  onPress?: () => void;
}
