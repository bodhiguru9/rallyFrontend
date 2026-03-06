export interface User {
  id: number;
  userId: number;
  mongoId: string;
  userType: 'player' | 'organiser';
  email?: string;
  mobileNumber?: string;
  profilePic?: string | null; // Made optional to match API response
  isEmailVerified?: boolean; // Added from API response
  isMobileVerified: boolean;
  fullName: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  sport1: string;
  sport2?: string;
  sports: string[];
  followingCount: number;
  followersCount?: number;
  eventsCreated?: number;
  totalAttendees?: number;
  isFollowing?: boolean; // Whether the current user is following this user
  profileVisibility?: 'public' | 'private'; // Profile visibility setting
  canFollow?: boolean; // Whether the current user can follow this user
  bio?: string; // User bio
  instagramLink?: string; // Instagram link
  communityName?: string; // Community name for organisers
  yourCity?: string; // User's city
  yourBest?: string; // User's best/type
}

export type UserType = 'player' | 'organiser';
