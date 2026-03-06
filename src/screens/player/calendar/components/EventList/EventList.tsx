import React from 'react';
import { FlexView } from '@components';
import { StyleSheet } from 'react-native';
import { DateGroup } from '../DateGroup';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { EmptyState } from '../EmptyState';
import type { PlayerBooking } from '@services/booking-service';
import type { CalendarTab } from '../../CalendarScreen.types';
import { styles } from './EventList.styles';

interface EventListProps {
  groupedEvents: { [key: string]: PlayerBooking[] };
  isLoading: boolean;
  error: unknown;
  activeTab: CalendarTab;
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
}

export const EventList: React.FC<EventListProps> = ({
  groupedEvents,
  isLoading,
  error,
  activeTab,
  onEventPress,
  onBookmark,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const sortedDateKeys = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  if (sortedDateKeys.length === 0) {
    return <EmptyState tab={activeTab} />;
  }

  return (
    <FlexView style={styles.eventsContainer}>
      {sortedDateKeys.map((dateKey, dateIndex) => {
        const dateEvents = groupedEvents[dateKey];
        return (
          <DateGroup
            key={dateIndex}
            events={dateEvents}
            onEventPress={onEventPress}
            onBookmark={onBookmark}
          />
        );
      })}
    </FlexView>
  );
};
