export type PreferencesScreenProps = Record<string, never>;

export interface PreferencesState {
  syncCalendar: string;
  eventReminders: string;
  followerNotifications: boolean;
  bookingConfirmations: boolean;
  updatesFromOrganisers: boolean;
  cancellationNotifications: boolean;
}

