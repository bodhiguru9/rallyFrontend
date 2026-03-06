import type { EventParticipant } from '@app-types';

export interface ParticipantProfilesProps {
  participants: EventParticipant[];
  /** When provided, the "View All" circle becomes pressable and calls this callback. */
  onViewAllPress?: () => void;
}
