import React, { useState, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePlayerBookings } from '@hooks/use-bookings';
import type { RootStackParamList } from '@navigation';
import type { CalendarTab } from './CalendarScreen.types';
import { TabSelector, EventList } from '@components/calendar';
import { DateFilter } from '@components';
import { useGroupedEvents } from './hooks/useGroupedEvents';
import { styles } from './style/CalendarScreen.styles';
import { HomeContainer } from '@components/global';
import type { PlayerBooking } from '@services/booking-service';
import { getDateFilters } from '@screens/home/context/Home.data';
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// inside component:

const PLAYER_CALENDAR_TABS = [
  { value: 'upcoming' as CalendarTab, label: 'Upcoming' },
  { value: 'past' as CalendarTab, label: 'Past' },
];

type CalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerCalendar'>;

export const CalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<CalendarTab>('upcoming');
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(getDateFilters());

  const { data: bookingsData, isLoading, error } = usePlayerBookings({
    status: 'all',
    page: 1,
  });

  const bookings = useMemo<PlayerBooking[]>(() => {
    return bookingsData?.data?.bookings || [];
  }, [bookingsData]);

  // Derive selectedDate from active dateFilter to pass into useGroupedEvents
  const selectedDate = useMemo<Date | null>(() => {
    const active = dateFilters.find(d => d.isSelected);
    return active?.fullDate ? new Date(active.fullDate) : null;
  }, [dateFilters]);

  const { groupedEvents } = useGroupedEvents({ events: bookings, activeTab, selectedDate });

  const selectDate = (fullDate: string | null) => {
    setDateFilters(prev =>
      prev.map(f => ({ ...f, isSelected: f.fullDate === fullDate })),
    );
  };

  const handleEventPress = (id: string) => {
    navigation.navigate('EventDetails', { eventId: id });
  };

  const handleBookmark = (id: string) => {
    void id;
  };

  return (
    <HomeContainer activeTab="calendar" userType="player">
      <View>
        <DateFilter dates={dateFilters} onSelectDate={selectDate} />
      </View>

      <TabSelector
        title="Your Calendar"
        tabs={PLAYER_CALENDAR_TABS}
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
        />
      </ScrollView>
    </HomeContainer>
  );
};