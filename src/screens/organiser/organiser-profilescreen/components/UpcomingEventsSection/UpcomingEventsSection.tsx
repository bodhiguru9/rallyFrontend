import React from 'react';
import { StyleSheet } from 'react-native';
import type { UpcomingEventsSectionProps } from './UpcomingEventsSection.types';
import { styles } from './style/UpcomingEventsSection.styles';
import { EventCard,  TextDs,  FlexView } from '@components';

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  onEventPress,
  onEventShare,
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.title}>Upcoming Events</TextDs>
      <FlexView style={styles.eventsList}>
        {events.map((event) => (
          <EventCard
            key={event.eventId}
            id={event.eventId}
            event={event}
            onPress={onEventPress}
            onBookmark={onEventShare || (() => { })}
            hidePrice={true}
          />
        ))}
      </FlexView>
    </FlexView>
  );
};

