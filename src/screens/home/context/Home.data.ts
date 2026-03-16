import type { Event, Organiser, DateFilter } from '../Home.types';
import { toLocalDateString } from '@utils/date-utils';

export const getDummyOrganisers = (): Organiser[] => [
  {
    userId: 1,
    fullName: 'Maria James',
    profilePic: 'https://i.pravatar.cc/150?img=1',
    isVerified: true,
    eventsHosted: 24,
  },
  {
    userId: 2,
    fullName: 'Berry Badminton',
    profilePic: 'https://i.pravatar.cc/150?img=2',
    isVerified: true,
    eventsHosted: 18,
  },
  {
    userId: 3,
    fullName: 'Mathew Cruz',
    profilePic: 'https://i.pravatar.cc/150?img=3',
    isVerified: true,
    eventsHosted: 32,
  },
  {
    userId: 4,
    fullName: 'Rebecca Jones',
    profilePic: 'https://i.pravatar.cc/150?img=4',
    isVerified: true,
    eventsHosted: 15,
  },
];

export const getDummyEvents = (): Event[] => [
  {
    id: '1',
    title: 'Hot Shot Badminton',
    organiser: {
      userId: 2,
      fullName: 'Ryan Matthew',
      profilePic: 'https://i.pravatar.cc/150?img=5',
      isVerified: false,
    },
    type: 'Badminton',
    categories: ['Sports', 'Social'],
    date: 'Sat 21 Oct',
    startTime: '1:00',
    endTime: '2:00 PM',
    location: {
      name: 'Hot Shot Badminton',
      address: 'Al Quoz',
      city: 'Dubai',
    },
    price: 95,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    status: 'open',
    participants: [
      { id: '1', name: 'John', avatar: 'https://i.pravatar.cc/150?img=10' },
      { id: '2', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=11' },
      { id: '3', name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=12' },
    ],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Under 19 Weekly Social',
    organiser: {
      userId: 6,
      fullName: 'Yamilet Sahiz',
      profilePic: 'https://i.pravatar.cc/150?img=6',
      isVerified: false,
    },
    type: 'Tennis',
    categories: ['Sports', 'Social'],
    date: 'Sat 24 Oct',
    startTime: '1:00',
    endTime: '2:00 PM',
    location: {
      name: 'Al Qouz Tennis Academy',
      address: 'Al Quoz',
      city: 'Dubai',
    },
    spotsAvailable: 5,
    price: 95,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
    status: 'open',
    participants: [
      { id: '4', name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=13' },
      { id: '5', name: 'Oliver', avatar: 'https://i.pravatar.cc/150?img=14' },
      { id: '6', name: 'Ava', avatar: 'https://i.pravatar.cc/150?img=15' },
    ],
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Tennis Americano',
    organiser: {
      userId: 7,
      fullName: 'Yanisha Soshi',
      profilePic: 'https://i.pravatar.cc/150?img=7',
      isVerified: false,
    },
    type: 'Tennis',
    categories: ['Sports', 'Social'],
    date: 'Sat 24 Oct',
    startTime: '1:00',
    endTime: '2:00 PM',
    location: {
      name: 'Maria Tennis Academy',
      address: 'Al Barsha',
      city: 'Dubai',
    },
    spotsAvailable: 3,
    price: 145,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
    status: 'waiting',
    participants: [
      { id: '7', name: 'Liam', avatar: 'https://i.pravatar.cc/150?img=16' },
      { id: '8', name: 'Sophia', avatar: 'https://i.pravatar.cc/150?img=17' },
      { id: '9', name: 'Noah', avatar: 'https://i.pravatar.cc/150?img=18' },
    ],
    isFeatured: true,
  },
  {
    id: '4',
    title: "Women's Day Special",
    organiser: {
      userId: 8,
      fullName: 'Cassey Green',
      profilePic: 'https://i.pravatar.cc/150?img=8',
      isVerified: false,
    },
    type: 'Padel',
    categories: ['Sports', 'Social'],
    date: '22 Oct',
    startTime: '1:00',
    endTime: '2:00 PM',
    location: {
      name: 'Oxygen Padel Academy',
      address: 'JLT',
      city: 'Dubai',
    },
    spotsAvailable: 0,
    price: 25,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    status: 'waiting',
    participants: [
      {
        id: '10',
        name: 'Isabella',
        avatar: 'https://i.pravatar.cc/150?img=19',
      },
      { id: '11', name: 'Mason', avatar: 'https://i.pravatar.cc/150?img=20' },
      { id: '12', name: 'Mia', avatar: 'https://i.pravatar.cc/150?img=21' },
    ],
  },
  {
    id: '5',
    title: 'Basketball 4 All',
    organiser: {
      userId: 9,
      fullName: 'Michael Smith',
      profilePic: 'https://i.pravatar.cc/150?img=9',
      isVerified: false,
    },
    type: 'Basketball',
    categories: ['Sports', 'Class'],
    date: '23 Oct',
    startTime: '1:00',
    endTime: '2:00 PM',
    location: {
      name: 'Al Raya School',
      address: 'Al Quoz',
      city: 'Dubai',
    },
    spotsAvailable: 4,
    price: 35,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    status: 'open',
    participants: [
      { id: '13', name: 'James', avatar: 'https://i.pravatar.cc/150?img=22' },
      {
        id: '14',
        name: 'Charlotte',
        avatar: 'https://i.pravatar.cc/150?img=23',
      },
      { id: '15', name: 'Lucas', avatar: 'https://i.pravatar.cc/150?img=24' },
    ],
  },
  {
    id: '6',
    title: 'Weekly Pilates Group',
    organiser: {
      userId: 10,
      fullName: 'Helen Marcella',
      profilePic: 'https://i.pravatar.cc/150?img=25',
      isVerified: false,
    },
    type: 'Pilates',
    categories: ['Sports', 'Tournament'],
    date: '23 Oct',
    startTime: '1:00',
    endTime: '2:00 PM',
    location: {
      name: 'GetFit Gym & Studio',
      address: 'Marina',
      city: 'Dubai',
    },
    price: 112,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    status: 'open',
    participants: [
      { id: '16', name: 'Amelia', avatar: 'https://i.pravatar.cc/150?img=26' },
      { id: '17', name: 'Ethan', avatar: 'https://i.pravatar.cc/150?img=27' },
      { id: '18', name: 'Harper', avatar: 'https://i.pravatar.cc/150?img=28' },
    ],
  },
  {
    id: '7',
    title: 'Hot Cricket',
    organiser: {
      userId: 11,
      fullName: 'Cricket Masters',
      profilePic: 'https://i.pravatar.cc/150?img=29',
      isVerified: true,
    },
    type: 'Cricket',
    categories: ['Sports', 'Social'],
    date: 'Sat 25 Oct',
    startTime: '3:00',
    endTime: '6:00 PM',
    location: {
      name: 'Dubai Cricket Stadium',
      address: 'Sports City',
      city: 'Dubai',
    },
    spotsAvailable: 8,
    price: 75,
    currency: 'AED',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
    status: 'open',
    participants: [
      { id: '19', name: 'David', avatar: 'https://i.pravatar.cc/150?img=30' },
      { id: '20', name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=31' },
      { id: '21', name: 'Chris', avatar: 'https://i.pravatar.cc/150?img=32' },
      { id: '22', name: 'Sophie', avatar: 'https://i.pravatar.cc/150?img=33' },
    ],
    isFeatured: false,
  },
];

export const getDateFilters = (): DateFilter[] => {
  const dates: DateFilter[] = [];
  const today = new Date();

  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    date.setHours(0, 0, 0, 0);

    dates.push({
      date: date.getDate(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isSelected: false,
      fullDate: toLocalDateString(date),
    });
  }

  return dates;
};
