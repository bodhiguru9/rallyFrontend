import type { EventData } from '@app-types';
import type { PlayerBooking } from '@services/booking-service';

export interface EventCardProps {
  id: string;
  event: EventData | PlayerBooking;
  onPress: (id: string) => void;
  onBookmark: (id: string) => void;
  hidePrice?: boolean;
  hideCreator?: boolean;
  /** When true, shows Going (green) or Ongoing (red) badge over the event image. Default false. */
  showStatus?: boolean;
  spotsStatusLabel?: string;
}
