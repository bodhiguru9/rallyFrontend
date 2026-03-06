import type { UpcomingEvent } from '../components/UpcomingEventsSection/UpcomingEventsSection.types';

export const mockProfileData = {
  logoUri: undefined,
  name: 'Berry Badminton',
  isVerified: true,
  instagramHandle: '@riyaberry123',
  stats: {
    hosted: 42,
    attendees: 392,
    subscribers: 77,
  },
  description:
    'Get ready to hit the court! Join us for an exciting padel event with 40 fellow enthusiasts.',
  activityTags: [
    { id: '1', label: 'Padel', icon: 'activity' },
    { id: '2', label: 'Table Tennis', icon: 'activity' },
  ],
};

export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Basketball 4 All',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    categories: [
      { label: 'Table Tennis', icon: 'activity', color: '#FFF3E7' },
      { label: 'Social', icon: 'users', color: '#E0F7F5' },
    ],
    date: 'Sat 24 Oct',
    time: '1:00 - 2:00 PM',
    location: 'Al Raya School Dubai, Unit..',
    participants: [
      { id: '1', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', avatar: 'https://i.pravatar.cc/150?img=4' },
    ],
    spotsAvailable: 5,
    views: 1200,
  },
  {
    id: '2',
    title: 'Basketball 4 All',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
    categories: [
      { label: 'Table Tennis', icon: 'activity', color: '#FFF3E7' },
      { label: 'Social', icon: 'users', color: '#E0F7F5' },
    ],
    date: 'Sat 24 Oct',
    time: '1:00 - 2:00 PM',
    location: 'Al Raya School Dubai, Unit..',
    participants: [
      { id: '1', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '2', avatar: 'https://i.pravatar.cc/150?img=6' },
      { id: '3', avatar: 'https://i.pravatar.cc/150?img=7' },
      { id: '4', avatar: 'https://i.pravatar.cc/150?img=8' },
    ],
    spotsAvailable: 3,
    views: 4300,
  },
];

