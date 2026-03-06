import type { EventData } from '@app-types';
import type { PurchasedPackage } from '../PurchasedPackagesScreen.types';

export interface PackageEvent {
  id: string;
  title: string;
  image: string;
  sport: string;
  eventType: string; // e.g., "Social", "Class"
  date: string; // e.g., "Sat 24 Oct"
  time: string; // e.g., "1:00 - 2:00 PM"
  location: string;
  participants: Array<{ id: string; avatar?: string }>;
  waitlistStatus: 'open' | 'closed';
}

export interface PackageDetail extends PurchasedPackage {
  expiresOn: string; // e.g., "23 Jan, 2025"
  events: EventData[];
}

export type PackageDetailScreenProps = Record<string, never>;

