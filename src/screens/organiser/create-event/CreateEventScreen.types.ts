import type { EventLocation } from '@app-types/location.types';

export interface CreateEventFormData {
  imageUri?: string | null;
  eventName: string;
  sport: string;
  eventType: string;
  dateTime: Date | null;
  /** Structured location from EventLocationSearch (OpenStreetMap), or legacy string. */
  location: EventLocation | string | null;
  /** Raw text from location input (fallback when user types without selecting). */
  locationRawInput?: string;
  description: string;
  maxGuests: string;
  pricePerGuest: string;
  isPrivate: boolean;
  disallowGuests: boolean;
  approvalRequired: boolean;
  registrationStartTime: Date | null;
  registrationEndTime: Date | null;
  registrationPolicy: string;
  saveToDrafts: boolean;
  frequency?: string[];
  /** Sent as eventDisallow in create event API */
  eventDisallow?: boolean;
  /** Sent as eventApprovalRequired in create event API */
  eventApprovalRequired?: boolean;
  restrictions?: {
    gender: string;
    sportsLevel: string;
    ageRange: {
      min: number;
      max: number;
    };
    levelRestriction?: string;
  };
}

export type CreateEventScreenProps = Record<string, never>;
