import React, { useState, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOrganiserEvents } from '@hooks/use-organiser-events';
import { useAuthStore } from '@store/auth-store';
import type { RootStackParamList } from '@navigation';
import type { CalendarTab } from './OrganiserCalendarScreen.types';
import {
  DatePicker,
  TabSelector,
  EventList,
} from '@components/calendar';
import { useGroupedEvents } from './hooks/useGroupedEvents';
import { styles } from './style/OrganiserCalendarScreen.styles';
import { HomeContainer } from '@components/global';
import { adaptEventDataToPlayerBooking } from './utils/eventAdapter';
import type { PlayerBooking } from '@services/booking-service';

const ORGANISER_CALENDAR_TABS = [
  { value: 'upcoming' as CalendarTab, label: 'Upcoming' },
  { value: 'past' as CalendarTab, label: 'Past' },
];

type OrganiserCalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrganiserCalendar'>;

export const OrganiserCalendarScreen: React.FC = () => {
  const navigation = useNavigation<OrganiserCalendarScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<CalendarTab>('upcoming');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const userId = useAuthStore((state) => state.user?.userId ?? state.user?.id ?? 0);
  const { data: organiserEventsData, isLoading, error } = useOrganiserEvents(userId, 1, 20, {
    enabled: userId > 0,
  });

  const events = useMemo<PlayerBooking[]>(() => {
    const organiserEvents = organiserEventsData?.data?.events ?? [];
    return organiserEvents.map(adaptEventDataToPlayerBooking);
  }, [organiserEventsData]);

  // Filter and group events by tab (now using PlayerBooking format)
  const { groupedEvents } = useGroupedEvents({ events, activeTab });

  const handleEventPress = (id: string) => {
    navigation.navigate('OrganiserEventDetails', { eventId: id });
  };

  const handleBookmark = (id: string) => {
    // TODO: Implement bookmark functionality
    void id;
  };

  return (
    <HomeContainer activeTab="calendar" userType="organiser">
      <DatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

      <TabSelector
        title="Events"
        tabs={ORGANISER_CALENDAR_TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as CalendarTab)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <EventList
          groupedEvents={groupedEvents}
          isLoading={isLoading}
          error={error}
          activeTab={activeTab}
          onEventPress={handleEventPress}
          onBookmark={handleBookmark}
          showTimeline={false}
          showStatus={false}
        />
      </ScrollView>
    </HomeContainer>
  );
};
