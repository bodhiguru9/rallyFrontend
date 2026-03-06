export type BannerVariant = 'waitlist' | 'registration' | 'private';

export interface YellowBannerProps {
  variant: BannerVariant | null;
  /** ISO date string for registration start; used when variant is 'registration' */
  eventRegistrationStartTime?: string | null;
}

export interface BannerConfig {
  title: string;
  description?: string;
}
