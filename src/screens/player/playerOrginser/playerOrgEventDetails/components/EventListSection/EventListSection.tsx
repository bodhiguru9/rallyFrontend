import React from 'react';
import { TextDs,  FlexView } from '@components';
import {StyleSheet} from 'react-native';
import { colors, spacing, getFontStyle } from '@theme';
import { EventListCard } from '../EventListCard';

interface Event {
  id: string;
  title: string;
  image: string;
  categories: string[];
  date: string;
  time: string;
  location: string;
  participants: Array<{ id: string; avatar?: string }>;
  spotsAvailable?: number;
  price: number;
}

interface EventListSectionProps {
  date: string;
  dayLabel: string;
  events: Event[];
  onEventPress: (id: string) => void;
  onEventShare: (id: string) => void;
}

export const EventListSection: React.FC<EventListSectionProps> = ({
  date,
  dayLabel,
  events,
  onEventPress,
  onEventShare,
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <FlexView style={styles.container}>
      <TextDs style={styles.sectionTitle}>
        {date} • {dayLabel}
      </TextDs>
      {events.map((event) => (
        <EventListCard
          key={event.id}
          {...event}
          onPress={onEventPress}
          onShare={onEventShare}
        />
      ))}
    </FlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...getFontStyle(14, 'bold'),
    color: colors.text.primary,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
});
