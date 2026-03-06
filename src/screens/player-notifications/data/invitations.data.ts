import type { Invitation } from '../components/InvitationCard/InvitationCard.types';

export const dummyInvitations: Invitation[] = [
  {
    id: '1',
    message: 'Berry Badminton has sent you a social invitation.',
    timestamp: '2d',
    organiserName: 'Berry badminton',
    organiserAvatarColor: '#FF69B4', // Pink
    organiserIcon: 'activity',
    eventName: 'Under 19 Weekly Social',
    eventImage: 'https://images.unsplash.com/photo-1622163642992-5d6c0e8b8b8b?w=400&h=300&fit=crop',
    tags: [
      {
        label: 'Padel',
        backgroundColor: '#FEF3E7',
        textColor: '#FF6B35',
      },
      {
        label: 'Social',
        backgroundColor: '#E0F7F5',
        textColor: '#4ECDC4',
      },
    ],
    dateTime: 'Sat 24 Oct, 1:00 - 2:00 PM',
    location: 'Al Raya School Dubai, Unit..',
  },
  {
    id: '2',
    message: 'Dubai Sports Club has sent you a social invitation.',
    timestamp: '1d',
    organiserName: 'Dubai Sports Club',
    organiserAvatarColor: '#4ECDC4', // Teal
    organiserIcon: 'activity',
    eventName: 'Weekend Tennis Tournament',
    eventImage: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&h=300&fit=crop',
    tags: [
      {
        label: 'Tennis',
        backgroundColor: '#FEF5E7',
        textColor: '#F39C12',
      },
      {
        label: 'Tournament',
        backgroundColor: '#F3E5F5',
        textColor: '#9C27B0',
      },
    ],
    dateTime: 'Sun 25 Oct, 3:00 - 5:00 PM',
    location: 'Dubai Sports City, Tennis Courts',
  },
];
