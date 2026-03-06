import { RootStackParamList } from '@navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface CommunityDetailsResponse {
  success: boolean;
  message: string;
  error?: string;
  action?: string;
  requestEndpoint?: string;
  profileVisibility?: 'public' | 'private';
  data?: {
    organiser: {
      userId: number;
      profilePic: string;
      fullName: string;
      communityName: string;
      totalEventsHosted: number;
      totalAttendees: number;
      totalSubscribers: number;
      bio: string;
      sports: string[];
      profileVisibility?: 'public' | 'private';
      instagramLink?: string; // ADD THIS LINE
    };
    events: Array<{
      eventId: string;
      eventName: string;
      eventSports: string[];
      eventDateTime: string;
      eventLocation: string;
      eventImages: string[];
      participants: Array<{ id: string; avatar?: string }>;
      participantsCount: number;
    }>;
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    summary: {
      totalEvents: number;
    };
  };
  organiser?: {
    userId: number;
    profilePic: string;
    fullName: string;
    communityName: string;
    profileVisibility?: 'public' | 'private';
    instagramLink?: string; // ADD THIS LINE
  };
}

export type PlayerOrgEventDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerOrgEventDetails'
>;
