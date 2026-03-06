import type { PurchasedPackage } from '../../PurchasedPackagesScreen.types';

export interface PackageCardProps {
  package: PurchasedPackage;
  onPress?: (id: string) => void;
}

