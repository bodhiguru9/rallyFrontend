export interface Participant {
  userId: number;
  userType: 'player' | 'organiser';
  email: string;
  mobileNumber: string;
  profilePic: string | null;
  fullName: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  sport1?: string;
  sport2?: string;
  joinedAt?: string;
  guestsCount?: number;
}

export interface MembersModalProps {
  visible: boolean;
  eventTitle: string;
  organizerName: string;
  participants: Participant[];
  spotsFilled: number;
  totalSpots: number;
  onClose: () => void;
}

