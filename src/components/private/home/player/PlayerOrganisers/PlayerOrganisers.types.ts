export interface PlayerOrganiser {
  id: string;
  name: string;
  organizerName: string;
  background: string | string[]; // Single color or gradient array
  icon?: string;
  iconType?: 'badminton' | 'padel' | 'social' | 'custom';
  hostedCount: number;
  attendeesCount: number;
  tags: string[];
  additionalTagsCount?: number;
  isFeatured?: boolean;
  mastersText?: string; // For featured card with "MASTERS" text
}

export interface PlayerOrganisersProps {
  organisers: PlayerOrganiser[];
  onOrganiserPress: (id: string) => void;
}
