import React from 'react';
import { EventCard, TextDs } from '@components';
import type { EventData } from '@app-types';
import { styles } from '../style/PlayerHomeContent.styles';
import { FlexView } from '@designSystem/atoms/FlexView';
import { spacing } from '@theme';

interface EventDateGroupProps {
  title: string;
  dayLabel: string;
  events: EventData[];
  isLast?: boolean;
  styleVariant?: 'default' | 'alt' | 'last';
  onEventPress: (id: string, occurrenceStart?: string, occurrenceEnd?: string) => void;
  onBookmark: (id: string) => void;
}

export const EventDateGroup: React.FC<EventDateGroupProps> = ({
  title,
  dayLabel,
  events,
  isLast = false,
  styleVariant = 'default',
  onEventPress,
  onBookmark,
}) => {
  const eventsContainerStyle = isLast
    ? styles.eventsContainerLast
    : styleVariant === 'alt'
      ? styles.eventsContainerAlt
      : styles.eventsContainer;

  return (
    <>
      <FlexView px={spacing.base} py={10}>
        <FlexView style={styles.dateLabelContainer}>
          <TextDs size={14} weight="semibold">{title}</TextDs>
          <TextDs size={14} weight="regular" color="secondary">
            • {dayLabel}
          </TextDs>
        </FlexView>
      </FlexView>

      <FlexView gap={spacing.base} style={eventsContainerStyle}>
        {events.map((event, index) => (
          <EventCard
            key={`${event.eventId}-${title}-${index}`}
            id={event.eventId}
            event={event}
            onPress={onEventPress}
            onBookmark={onBookmark}
          />
        ))}
      </FlexView>
    </>
  );
};
