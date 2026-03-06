import React, { useMemo, useState } from 'react';
import { TextDs, FlexView } from '@components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CalendarEventCard } from './CalendarEventCard';
import { styles } from '../style/PlayerHomeContent.styles';
import { EventData } from '@app-types';
import { ArrowIcon } from '@components/global/ArrowIcon';
import type { RootStackParamList } from '@navigation';

type YourCalendarSectionNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface YourCalendarSectionProps {
  events: EventData[];
  onEventPress: (id: string) => void;
  onBookmark: (id: string) => void;
}

export const YourCalendarSection: React.FC<YourCalendarSectionProps> = ({
  events,
  onEventPress,
}) => {
  const navigation = useNavigation<YourCalendarSectionNavigationProp>();

  // Store current timestamp in state using lazy initialization
  // The function is only called once on mount, avoiding impure function calls during render
  const [now] = useState<number>(() => Date.now());

  const handleCalendarPress = () => {
    navigation.navigate('PlayerCalendar');
  };

  // Filter out past events and get the closest upcoming event based on eventDateTime
  const selectedEvent = useMemo(() => {
    if (!events || events.length === 0) {
      return null;
    }

    const upcomingEvents = events
      .filter((event) => {
        const eventTimestamp = new Date(event.eventDateTime).getTime();
        return !Number.isNaN(eventTimestamp) && eventTimestamp > now;
      })
      .sort((a, b) => {
        const timestampA = new Date(a.eventDateTime).getTime();
        const timestampB = new Date(b.eventDateTime).getTime();
        return timestampA - timestampB;
      });

    return upcomingEvents[0] || null;
  }, [events, now]);

  if (!selectedEvent) {
    return null;
  }
  return (
    <FlexView mb={10}>
      <FlexView style={styles.sectionHeader}>
        <TextDs size={16} weight='semibold'>Your Calendar</TextDs>
        <ArrowIcon variant='right' size="small" onClick={handleCalendarPress} />
      </FlexView>
      <FlexView style={styles.calendarContent}>
        <CalendarEventCard key={selectedEvent.id} event={selectedEvent} onPress={onEventPress} />
      </FlexView>
    </FlexView>
  );
};
