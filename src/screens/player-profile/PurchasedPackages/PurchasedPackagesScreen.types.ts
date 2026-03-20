export interface PurchasedPackage {
  /** Unique row id (purchase / transaction) for list keys */
  purchaseId: string;
  /** Package definition id (for navigation and package details API) */
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
  /** When known (API), passed through to package detail */
  expiresOn?: string;
}

export type PurchasedPackagesScreenProps = Record<string, never>;

