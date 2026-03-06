import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '@navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { spacing } from '@theme';
import { styles } from '../style/OrganiserCreateEventHome.styles';
import { EventData } from '@app-types';
import { EventCard, TextDs } from '@components';
import { ArrowIcon } from '@components/global/ArrowIcon';
import { FlexView } from '@designSystem/atoms/FlexView';

interface OrganiserCreateEventHomeProps {
  events: EventData[];
}

export const OrganiserCreateEventHome: React.FC<OrganiserCreateEventHomeProps> = ({ events }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleEventPress = (id: string) => {
    navigation.navigate('OrganiserEventDetails', { eventId: id });
  };

  const handleCalendarPress = () => {
    navigation.navigate('OrganiserCalendar');
  };

  const handleBookmark = (_id: string) => {
    // Handle bookmark functionality for organiser's own events
    // TODO: Implement bookmark functionality
  };

  if (!events.length) {
    return (
      <FlexView style={styles.section}>
        <FlexView style={styles.emptyCard}>
          <TextDs style={styles.emptyText}>No created events yet.</TextDs>
        </FlexView>
      </FlexView>
    );
  }

  return (
    <FlexView style={styles.section}>
      <FlexView alignItems='center' flexDirection='row' justifyContent='space-between' mt={spacing.md} mb={spacing.base}>
        <TextDs size={16} weight="semibold">Your Calendar</TextDs>
        <ArrowIcon variant='right' onClick={handleCalendarPress} size='small' />
      </FlexView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
      >
        {events.map((event) => {
          const eventId = event.eventId || event.id || '';
          return (
            <FlexView key={eventId} style={styles.cardWrapper}>
              <EventCard
                id={eventId}
                event={event}
                onPress={handleEventPress}
                onBookmark={handleBookmark}
                hidePrice
                hideCreator={true}
              />
            </FlexView>
          );
        })}
      </ScrollView>
    </FlexView>
  );
};
