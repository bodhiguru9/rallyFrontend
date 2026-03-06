import type { PlayerOrganiser } from '../PlayerOrganisers.types';

export const getDummyPlayerOrganisers = (): PlayerOrganiser[] => [
  {
    id: '1',
    name: 'Berry Socials',
    organizerName: 'Riye Berry',
    background: '#10B981', // Green
    iconType: 'custom',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel', 'Pilates'],
    additionalTagsCount: 2,
    isFeatured: true,
    mastersText: 'MASTERS',
  },
  {
    id: '2',
    name: 'Berry Badminton',
    organizerName: 'Riye Berry',
    background: ['#FF6B9D', '#C44569'], // Pink to purple gradient
    iconType: 'badminton',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel'],
    additionalTagsCount: 2,
  },
  {
    id: '3',
    name: 'Rally Socials',
    organizerName: 'Ahmed Khan',
    background: '#3B82F6', // Blue
    iconType: 'social',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel', 'Pilates'],
    additionalTagsCount: 2,
  },
  {
    id: '4',
    name: 'Padelina',
    organizerName: 'Venika',
    background: '#FFB6C1', // Light pink
    iconType: 'padel',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel'],
    additionalTagsCount: 2,
  },
  {
    id: '5',
    name: 'More with Yashi',
    organizerName: 'Yashi',
    background: ['#FFE66D', '#A8E6CF'], // Yellow to light blue gradient
    iconType: 'custom',
    hostedCount: 25,
    attendeesCount: 913,
    tags: ['Padel'],
    additionalTagsCount: 2,
  },
];
