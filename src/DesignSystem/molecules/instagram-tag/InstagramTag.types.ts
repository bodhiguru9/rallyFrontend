export type InstagramTagSize = 'small' | 'medium' | 'large';

export interface InstagramTagProps {
  /**
   * Instagram profile link or username (with or without @ symbol)
   * Accepts formats like:
   * - https://instagram.com/username
   * - https://www.instagram.com/username
   * - instagram.com/username
   * - @username
   * - username
   */
  instagramLink: string;

  /**
   * Optional callback when tag is pressed
   * If not provided, will open Instagram profile by default
   */
  onPress?: (username: string) => void;

  /**
   * Size of the tag
   * @default 'medium'
   */
  size?: InstagramTagSize;

  /**
   * Whether to show the Instagram icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Whether the tag is disabled
   * @default false
   */
  disabled?: boolean;
}
