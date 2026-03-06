import type { MostBookedMember } from '../../data/organiserDashboard.data';

export interface MostBookedSectionProps {
  members?: MostBookedMember[]; // Optional - component will fetch from API if not provided
  onPress?: () => void;
}

