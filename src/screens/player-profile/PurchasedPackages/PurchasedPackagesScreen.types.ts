export interface PurchasedPackage {
  id: string;
  title: string;
  organizerName: string;
  organizerAvatar?: string;
  validity: string; // e.g., "3 months"
  sport: string; // e.g., "Pilates"
  purchasedOn: string; // e.g., "23 Oct, 25"
  eventTypes: string[]; // e.g., ["Social", "Class"]
  totalEvents: number;
  usedEvents: number;
}

export type PurchasedPackagesScreenProps = Record<string, never>;

