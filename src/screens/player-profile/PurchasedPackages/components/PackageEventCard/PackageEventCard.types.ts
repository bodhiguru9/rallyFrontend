import type { PackageEvent } from '../../PackageDetail/PackageDetailScreen.types';

export interface PackageEventCardProps {
  event: PackageEvent;
  onPress?: (id: string) => void;
  onShare?: (id: string) => void;
}

