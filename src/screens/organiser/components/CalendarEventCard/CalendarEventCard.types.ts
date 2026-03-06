import type { CalendarEvent } from '../../data/organiserDashboard.data';

export interface CalendarEventCardProps {
  event: CalendarEvent;
  onPress?: (id: string) => void;
}

