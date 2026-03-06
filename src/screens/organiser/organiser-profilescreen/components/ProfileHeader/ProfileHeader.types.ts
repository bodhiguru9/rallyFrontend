export interface ProfileHeaderProps {
  logoUri?: string;
  name: string;
  communityName?: string;
  isVerified?: boolean;
  instagramHandle?: string;
  stats: {
    hosted: number;
    attendees: number;
    subscribers: number;
  };
  description: string;
  activityTags: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
  onSubscribersPress?: () => void;
  onAttendeesPress?: () => void;
  onHostedPress?: () => void;
}

