import type { EventData } from '@app-types';

export interface UpcomingEvent {
  id: string;
  title: string;
  image: string;
  categories: Array<{ label: string; icon: string; color?: string }>;
  date: string;
  time?: string;
  location?: string;
  [key: string]: unknown;
}

export interface UpcomingEventsSectionProps {
  events: EventData[];
  onEventPress: (id: string) => void;
  onEventShare?: (id: string) => void;
}

