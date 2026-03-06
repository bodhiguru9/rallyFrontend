import type { PickedOrganiserData } from '../components/PickedForYouSection';

// Dummy data for featured organiser card (MASTERS card)
export const FEATURED_ORGANISER = {
  id: 'featured-1',
  name: 'Berry Socials',
  organizerName: 'Riya Durry',
  background: '#10B981', // Green
  hostedCount: 25,
  attendeesCount: 913,
  tags: ['Padel', 'Plays'],
  mastersText: 'MASTERS',
};

// Dummy data for picked events cards
export const PICKED_ORGANISERS: PickedOrganiserData[] = [
  {
    id: 'picked-1',
    name: 'BERRY BADMINTON',
    subtitle: 'JOIN OUR SOCIALS',
    organizerName: 'Riya Barry',
    profilePic: '',
    background: ['#FF6B9D', '#C44569'], // Pink to purple gradient
    iconType: 'badminton',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel'],
    additionalTagsCount: 2,
  },
  {
    id: 'picked-2',
    name: 'Rally Socials',
    organizerName: 'Ahmed Khan',
    background: '#3B82F6', // Blue
    profilePic: '',
    iconType: 'social',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel', 'Plays'],
    additionalTagsCount: 2,
  },
  {
    id: 'picked-3',
    name: 'PADELINA',
    organizerName: 'Venika',
    background: '#FFB6C1', // Light pink
    profilePic: '',
    iconType: 'padel',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel'],
    additionalTagsCount: 2,
  },
  {
    id: 'picked-4',
    name: 'More with Yashi',
    organizerName: 'Yashi',
    background: ['#FFE66D', '#A8E6CF'], // Yellow to light blue gradient
    profilePic: '',
    iconType: 'custom',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel'],
    additionalTagsCount: 2,
  },
];
