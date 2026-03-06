import type { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import type { ImageKey } from '@assets/images';

/** PascalCase variant of ImageKey for usage like image="InstaIcon" */
type PascalCaseImageKey = { [K in ImageKey]: Capitalize<K> }[ImageKey];

/** Image name: camelCase (instaIcon) or PascalCase (InstaIcon) from @assets/images */
export type ImageDsImageName = ImageKey | PascalCaseImageKey;

export type ImageFit = 'contain' | 'cover' | 'stretch' | 'repeat' | 'center';

export interface ImageDsProps {
  /** Asset name from @assets/images – e.g. "InstaIcon" or "instaIcon" */
  image: ImageDsImageName;
  /** Width and height in pixels. Default: 16 */
  size?: number;
  /** Resize mode. Default: "contain" */
  fit?: ImageFit;
  /** Optional Image source override (takes precedence over image name) */
  source?: ImageSourcePropType;
  /** Optional style (e.g. for illustrations or layout) */
  style?: StyleProp<ImageStyle>;
  /** Optional accessibility label */
  accessibilityLabel?: string;
}
