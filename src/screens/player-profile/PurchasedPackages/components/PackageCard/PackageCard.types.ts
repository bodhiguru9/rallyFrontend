import type { PurchasedPackage } from '../../PurchasedPackagesScreen.types';

export interface PackageCardProps {
  package: PurchasedPackage;
  onPress?: () => void;
}

