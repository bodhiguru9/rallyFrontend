export interface SummaryCard {
  value: string;
  label: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  image: string;
  sport: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  participants: Array<{ id: string; avatar?: string }>;
}

export interface MostBookedMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  memberName: string;
  memberAvatar?: string;
  eventName?: string;
  bookedDate: string;
  bookedTime: string;
  amount: number;
  currency: string;
}

export interface OrganiserDashboardData {
  summaryCards: SummaryCard[];
  calendarEvent: CalendarEvent | null;
  mostBooked: MostBookedMember[];
  transactions: Transaction[];
}
