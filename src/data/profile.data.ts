import { images } from "@assets/images";

export const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];


export const sportOptions = [
  { label: 'Tennis', value: 'tennis', icon: images.tennisIcon },
  { label: 'Badminton', value: 'badminton', icon: images.badmintonIcon },
  { label: 'Basketball', value: 'basketball', icon: images.basketballIcon },
  { label: 'Padel', value: 'padel', icon: images.padelIcon },
  // { label: 'Pilates', value: 'pilates', icon: images.pilatesIcon },
  { label: 'Football', value: 'football', icon: images.footballIcon },
  // { label: 'Swimming', value: 'swimming', icon: images.swimmingIcon },
  // { label: 'Running', value: 'running', icon: images.runningIcon },
  // { label: 'Yoga', value: 'yoga', icon: images.yogaIcon },
  { label: 'Cricket', value: 'cricket', icon: images.cricketIcon },
];

export const yourBestOptions = [
  { label: 'Organiser', value: 'Organiser' },
  { label: 'Coach', value: 'coach' },
  { label: 'Club', value: 'club' },
];

export const profileVisibilityOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];
