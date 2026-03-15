import React, { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useOrganiserEvents } from '@hooks/use-organiser-events';
import { useAuthStore } from '@store/auth-store';
import type { RootStackParamList } from '@navigation';
import type { CalendarTab } from './OrganiserCalendarScreen.types';
import { TabSelector, EventList } from '@components/calendar';
import { DateFilter } from '@components';
import { useGroupedEvents } from './hooks/useGroupedEvents';
import { styles } from './style/OrganiserCalendarScreen.styles';
import { HomeContainer } from '@components/global';
import { adaptEventDataToPlayerBooking } from './utils/eventAdapter';
import type { PlayerBooking } from '@services/booking-service';
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GST_TIME_ZONE = 'Asia/Dubai';

const getDatePart = (
  date: Date,
  part: 'day' | 'weekday' | 'month' | 'year',
  format?: 'short' | 'numeric',
) => {
  const options: Intl.DateTimeFormatOptions = { timeZone: GST_TIME_ZONE };

  if (part === 'day') {
    options.day = 'numeric';
  }
  if (part === 'weekday') {
    options.weekday = 'short';
  }
  if (part === 'month') {
    options.month = 'short';
  }
  if (part === 'year') {
    options.year = format === 'numeric' ? 'numeric' : '2-digit';
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const getGstDateFilters = (): DateFilterType[] => {
  const dates: DateFilterType[] = [];
  const now = new Date();

  for (let i = 0; i < 8; i++) {
    const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const year = getDatePart(date, 'year', 'numeric');
    const month = String(
      new Intl.DateTimeFormat('en-US', { timeZone: GST_TIME_ZONE, month: '2-digit' }).format(date),
    );
    const day = String(
      new Intl.DateTimeFormat('en-US', { timeZone: GST_TIME_ZONE, day: '2-digit' }).format(date),
    );

    dates.push({
      date: Number(getDatePart(date, 'day')),
      day: getDatePart(date, 'weekday'),
      month: getDatePart(date, 'month'),
      isSelected: false,
      fullDate: `${year}-${month}-${day}T00:00:00+04:00`,
    });
  }

  return dates;
};

const ORGANISER_CALENDAR_TABS = [
  { value: 'upcoming' as CalendarTab, label: 'Upcoming' },
  { value: 'past' as CalendarTab, label: 'Past' },
];

type OrganiserCalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrganiserCalendar'>;

export const OrganiserCalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<OrganiserCalendarScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<CalendarTab>('upcoming');
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(getGstDateFilters());

  const userId = useAuthStore((state) => state.user?.userId ?? state.user?.id ?? 0);
  const { data: organiserEventsData, isLoading, error } = useOrganiserEvents(userId, 1, 20, {
    enabled: userId > 0,
  });

  const events = useMemo<PlayerBooking[]>(() => {
    const organiserEvents = organiserEventsData?.data?.events ?? [];
    return organiserEvents.map(adaptEventDataToPlayerBooking);
  }, [organiserEventsData]);

  // Derive selectedDate from active dateFilter to pass into useGroupedEvents
  const selectedDate = useMemo<Date | null>(() => {
    const active = dateFilters.find(d => d.isSelected);
    return active?.fullDate ? new Date(active.fullDate) : null;
  }, [dateFilters]);

  const { groupedEvents } = useGroupedEvents({ events, activeTab, selectedDate });

  const toDateKey = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const selectDate = (fullDate: string | null) => {
    setDateFilters((prev) => {
      if (!fullDate) {
        return prev.map((f) => ({ ...f, isSelected: false }));
      }
      const targetKey = toDateKey(fullDate);
      const exists = prev.some((f) => f.fullDate && toDateKey(f.fullDate) === targetKey);
      if (exists) {
        return prev.map((f) => ({
          ...f,
          isSelected: f.fullDate ? toDateKey(f.fullDate) === targetKey : false,
        }));
      }
      // Add the selected date from calendar popup when not in the list
      const d = new Date(fullDate);
      const newEntry = {
        date: d.getDate(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isSelected: true,
        fullDate: d.toISOString(),
      };
      const updated = prev.map((f) => ({ ...f, isSelected: false }));
      return [...updated, newEntry];
    });
  };

  const handleEventPress = (id: string) => {
    navigation.navigate('OrganiserEventDetails', { eventId: id });
  };

  const handleBookmark = (id: string) => {
    void id;
  };

  return (
    <HomeContainer activeTab="calendar" userType="organiser">
      <View style={{ paddingTop: insets.top }}>
        <DateFilter dates={dateFilters} onSelectDate={selectDate} />
      </View>

      <TabSelector
        title="Your Calendar"
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
          showStatus={false}
          displayTimeZone={GST_TIME_ZONE}
        />
      </ScrollView>
    </HomeContainer>
  );
};
