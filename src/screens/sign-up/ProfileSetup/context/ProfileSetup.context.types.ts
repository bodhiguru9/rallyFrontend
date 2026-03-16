import { RootStackParamList } from '@navigation';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReactNode } from 'react';

export type TProfileSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileSetup'
>;
export type TProfileSetupScreenRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'ProfileSetup'
>['route'];

export interface IProfileSetupContextValue {
  // Contact info
  email: string;
  setEmail: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  userType: 'player' | 'organiser' | undefined;
  // Original values from route params to determine signup method
  initialEmail: string | undefined;
  initialPhoneNumber: string | undefined;

  // Common profile form state
  fullName: string;
  setFullName: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  primarySport: string;
  setPrimarySport: (value: string) => void;
  secondarySport: string;
  setSecondarySport: (value: string) => void;
  avatar: string | null;

  // Player-specific fields
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  setGender: (value: 'male' | 'female' | 'other') => void;

  // Organiser-specific fields
  yourBest: 'Organiser' | 'coach' | 'club';
  setYourBest: (value: 'Organiser' | 'coach' | 'club') => void;
  communityName: string;
  setCommunityName: (value: string) => void;
  yourCity: string;
  setYourCity: (value: string) => void;
  additionalSports: string[];
  setAdditionalSports: (value: string[]) => void;
  additionalSportText: string;
  setAdditionalSportText: (value: string) => void;
  showAdditionalSport: boolean;
  setShowAdditionalSport: (value: boolean) => void;
  bio: string;
  setBio: (value: string) => void;
  instagramLink: string;
  setInstagramLink: (value: string) => void;
  profileVisibility: 'public' | 'private';
  setProfileVisibility: (value: 'public' | 'private') => void;

  // Loading state
  isLoading: boolean;

  // Actions
  handleCompleteSignUp: () => Promise<void>;
  handleAvatarSelect: (imageUri: string) => void;
  handleDateChange: (date: string) => void;
}

export interface IProfileSetupProviderProps {
  children: ReactNode;
}
