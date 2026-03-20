// Dummy data for organiser profile
export const ORGANISER_DATA = {
  id: 'org-1',
  name: 'Sarah James',
  creatorName: 'Riya Berry',
  isVerified: true,
  profileImage: 'https://i.pravatar.cc/150?img=47',
  hostedCount: 342,
  attendeesCount: 12200,
  subscribersCount: 1200,
  description: 'Get ready to hit the court! Join us for an exciting padel event with 40 fellow enthusiasts.',
  tags: ['Padel', 'Table Tennis'],
};

export interface PackageData {
  id: string;
  title: string;
  validity: string;
  sport: string;
  eventType: string;
  numberOfEvents: number;
  price: number;
  currency?: string;
}

// Dummy data for filters
export const FILTERS = [
  { id: 'sports', label: 'Sports' },
  { id: 'eventType', label: 'Event Type' },
  { id: 'location', label: 'Location' },
  { id: 'price', label: 'Price' },
];

// Dummy data for dates
export const getDates = (): Array<{ date: number; day: string; isSelected: boolean }> => {
  return [
    { date: 6, day: 'Sat', isSelected: true },
    { date: 10, day: 'Sun', isSelected: false },
    { date: 15, day: 'Thu', isSelected: false },
    { date: 16, day: 'Fri', isSelected: false },
    { date: 21, day: 'Sun', isSelected: false },
    { date: 25, day: 'Thu', isSelected: false },
    { date: 26, day: 'Fri', isSelected: false },
  ];
};

// Dummy data for events
export const getEvents = () => {
  return [
    {
      date: 'Today',
      dayLabel: 'Saturday',
      events: [
        {
          id: 'event-1',
          title: 'Under 19 Weekly Social',
          image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400',
          categories: ['Table Tennis', 'Social'],
          date: 'Sat 24 Oct',
          time: '1:00 - 2:00 PM',
          location: 'Al Quoz Academy, Dubai',
          participants: [
            { id: '1', avatar: 'https://i.pravatar.cc/150?img=10' },
            { id: '2', avatar: 'https://i.pravatar.cc/150?img=11' },
            { id: '3', avatar: 'https://i.pravatar.cc/150?img=12' },
            { id: '4', avatar: 'https://i.pravatar.cc/150?img=13' },
          ],
          spotsAvailable: undefined,
          price: 95,
        },
        {
          id: 'event-2',
          title: 'Tennis Americano',
          image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400',
          categories: ['Tennis', 'Social'],
          date: 'Sat 24 Oct',
          time: '1:00 - 2:00 PM',
          location: 'Maria Tennis Academy, Dubai',
          participants: [
            { id: '5', avatar: 'https://i.pravatar.cc/150?img=14' },
            { id: '6', avatar: 'https://i.pravatar.cc/150?img=15' },
            { id: '7', avatar: 'https://i.pravatar.cc/150?img=16' },
            { id: '8', avatar: 'https://i.pravatar.cc/150?img=17' },
          ],
          spotsAvailable: undefined,
          price: 145,
        },
      ],
    },
    {
      date: '22 Oct',
      dayLabel: 'Sunday',
      events: [
        {
          id: 'event-3',
          title: 'Weekly Pilates Group',
          image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
          categories: ['Pilates', 'Tournament'],
          date: 'Sat 24 Oct',
          time: '1:00 - 2:00 PM',
          location: 'GetFit Gym & Studio, Dubai',
          participants: [
            { id: '9', avatar: 'https://i.pravatar.cc/150?img=18' },
            { id: '10', avatar: 'https://i.pravatar.cc/150?img=19' },
            { id: '11', avatar: 'https://i.pravatar.cc/150?img=20' },
            { id: '12', avatar: 'https://i.pravatar.cc/150?img=21' },
          ],
          spotsAvailable: undefined,
          price: 112,
        },
      ],
    },
    {
      date: '23 Oct',
      dayLabel: 'Monday',
      events: [
        {
          id: 'event-4',
          title: 'Basketball 4 All',
          image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
          categories: ['Basketball', 'Class'],
          date: 'Sat 24 Oct',
          time: '1:00 - 2:00 PM',
          location: 'Al Raya School, Dubai',
          participants: [
            { id: '13', avatar: 'https://i.pravatar.cc/150?img=22' },
            { id: '14', avatar: 'https://i.pravatar.cc/150?img=23' },
            { id: '15', avatar: 'https://i.pravatar.cc/150?img=24' },
            { id: '16', avatar: 'https://i.pravatar.cc/150?img=25' },
          ],
          spotsAvailable: 5,
          price: 35,
        },
      ],
    },
  ];
};
