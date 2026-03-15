import type { MostBookedMember } from '../../data/organiserDashboard.data';

export interface MostBookedMemberPressPayload {
  userId: number;
  fullName: string;
  profilePic?: string;
}

export interface MostBookedSectionProps {
  members?: MostBookedMember[]; // Optional - component will fetch from API if not provided
  onPress?: () => void;
  onMemberPress?: (member: MostBookedMemberPressPayload) => void;
}

