import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Event } from '../../home/Home.types';
import { RootStackParamList } from '@navigation';

export interface BookingConfirmationProps {
  event: Event;
  bookingId: string;
  amountPaid: number;
  currency: string;
  guestsCount: number;
  subtotal?: number;
  vatAmount?: number;
  discountAmount?: number;
  onDone: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
}

export type TBookingConfirmationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BookingConfirmation'
>;

export type TBookingConfirmationRouteProp = NativeStackScreenProps<
  RootStackParamList,
  'BookingConfirmation'
>['route'];
