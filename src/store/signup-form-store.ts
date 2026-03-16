import { create } from 'zustand';

interface SignupFormState {
  // Step 1 fields (SignUp screen)
  userType: 'player' | 'organiser';
  phoneNumber: string;
  email: string;
  useEmail: boolean;

  // Step 3 fields (ProfileSetup screen)
  fullName: string;
  password: string;
  confirmPassword: string;
  primarySport: string;
  secondarySport: string;
  avatar: string | null;

  // Player-specific
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';

  // Organiser-specific
  yourBest: 'Organiser' | 'coach' | 'club';
  communityName: string;
  yourCity: string;
  additionalSports: string[];
  additionalSportText: string;
  showAdditionalSport: boolean;
  bio: string;
  instagramLink: string;
  profileVisibility: 'public' | 'private';

  // Step 1 setters
  setUserType: (value: 'player' | 'organiser') => void;
  setPhoneNumber: (value: string) => void;
  setEmail: (value: string) => void;
  setUseEmail: (value: boolean) => void;

  // Step 3 setters
  setFullName: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setPrimarySport: (value: string) => void;
  setSecondarySport: (value: string) => void;
  setAvatar: (value: string | null) => void;

  // Player-specific setters
  setDateOfBirth: (value: string) => void;
  setGender: (value: 'male' | 'female' | 'other') => void;

  // Organiser-specific setters
  setYourBest: (value: 'Organiser' | 'coach' | 'club') => void;
  setCommunityName: (value: string) => void;
  setYourCity: (value: string) => void;
  setAdditionalSports: (value: string[]) => void;
  setAdditionalSportText: (value: string) => void;
  setShowAdditionalSport: (value: boolean) => void;
  setBio: (value: string) => void;
  setInstagramLink: (value: string) => void;
  setProfileVisibility: (value: 'public' | 'private') => void;

  // Reset
  clearSignupForm: () => void;
}

const initialState = {
  // Step 1
  userType: 'player' as const,
  phoneNumber: '',
  email: '',
  useEmail: false,

  // Step 3 common
  fullName: '',
  password: '',
  confirmPassword: '',
  primarySport: '',
  secondarySport: '',
  avatar: null as string | null,

  // Player-specific
  dateOfBirth: '',
  gender: 'male' as const,

  // Organiser-specific
  yourBest: 'Organiser' as const,
  communityName: '',
  yourCity: '',
  additionalSports: [] as string[],
  additionalSportText: '',
  showAdditionalSport: false,
  bio: '',
  instagramLink: '',
  profileVisibility: 'private' as const,
};

export const useSignupFormStore = create<SignupFormState>()((set) => ({
  ...initialState,

  // Step 1 setters
  setUserType: (value) => set({ userType: value }),
  setPhoneNumber: (value) => set({ phoneNumber: value }),
  setEmail: (value) => set({ email: value }),
  setUseEmail: (value) => set({ useEmail: value }),

  // Step 3 setters
  setFullName: (value) => set({ fullName: value }),
  setPassword: (value) => set({ password: value }),
  setConfirmPassword: (value) => set({ confirmPassword: value }),
  setPrimarySport: (value) => set({ primarySport: value }),
  setSecondarySport: (value) => set({ secondarySport: value }),
  setAvatar: (value) => set({ avatar: value }),

  // Player-specific setters
  setDateOfBirth: (value) => set({ dateOfBirth: value }),
  setGender: (value) => set({ gender: value }),

  // Organiser-specific setters
  setYourBest: (value) => set({ yourBest: value }),
  setCommunityName: (value) => set({ communityName: value }),
  setYourCity: (value) => set({ yourCity: value }),
  setAdditionalSports: (value) => set({ additionalSports: value }),
  setAdditionalSportText: (value) => set({ additionalSportText: value }),
  setShowAdditionalSport: (value) => set({ showAdditionalSport: value }),
  setBio: (value) => set({ bio: value }),
  setInstagramLink: (value) => set({ instagramLink: value }),
  setProfileVisibility: (value) => set({ profileVisibility: value }),

  // Reset all signup form data
  clearSignupForm: () => set(initialState),
}));
