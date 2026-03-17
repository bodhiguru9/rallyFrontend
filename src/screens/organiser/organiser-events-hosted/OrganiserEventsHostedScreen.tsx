import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';
import { Card } from '@components/global/Card';
import { FilterDropdown } from '@components/global/filter-dropdown';
import { DateFilter } from '@components';
import { EventCard } from '@components/global/EventCard';
import { useOrganiserEvents } from '@hooks/use-organiser-events';
import { useAuthStore } from '@store/auth-store';
import { useFilterOptions } from '@hooks';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserEventsHostedScreen.styles';
import { generateDateFilters } from '@utils/date-utils';
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';
import { ChevronDown } from 'lucide-react-native';
import { isRecurringEventOnDate, getRecurringEventInstanceDateTime } from '@utils/recurrence-utils';

type TNavigation = NativeStackNavigationProp<RootStackParamList, 'OrganiserEventsHosted'>;

export const OrganiserEventsHostedScreen: React.FC = () => {
  const navigation = useNavigation<TNavigation>();
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((state) => state.user?.userId || 0);
  const { data, isLoading } = useOrganiserEvents(userId, 1, 20, { enabled: userId > 0 });

  const [isPeriodPickerVisible, setIsPeriodPickerVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedSports, setSelectedSports] = useState<string[]>(['all-sports']);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['all-event-types']);
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>(['most-recent']);
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(() => {
    const today = new Date();
    return generateDateFilters(today, 30);
  });

  const periodOptions = [
    { label: 'All Time', value: 'all-time' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last 6 Months', value: 'last-6-months' },
  ];

  const { data: filterOptionsData } = useFilterOptions();

  const sportsOptions = useMemo(() => {
    const PRIMARY_SPORTS = [
      'Padel',
      'Badminton',
      'Cricket',
      'Indoor Cricket',
      'Pickleball',
      'Tennis',
      'Football',
      'Table-tennis',
      'Pilates',
      'Basketball',
      'Running',
      'Volleyball',
    ];

    const iconMap: Record<string, string> = {
      'Padel': 'padelIcon',
      'Badminton': 'badmintonIcon',
      'Cricket': 'cricketIcon',
      'Indoor Cricket': 'indoorCricketIcon',
      'Pickleball': 'pickleballIcon',
      'Tennis': 'tennisIcon',
      'Football': 'footballIcon',
      'Table-tennis': 'tableTennisIcon',
      'Table Tennis': 'tableTennisIcon',
      'Pilates': 'pilatesIcon',
      'Basketball': 'basketballIcon',
      'Running': 'runningIcon',
      'Volleyball': 'basketballIcon',
    };

    const backendSports = filterOptionsData?.sports || [];
    const combinedSports = [...PRIMARY_SPORTS];
    backendSports.forEach(bs => {
      if (!combinedSports.some(cs => cs.toLowerCase() === bs.toLowerCase())) {
        combinedSports.push(bs);
      }
    });

    const mappedSports = combinedSports
      .sort((a, b) => {
        const indexA = PRIMARY_SPORTS.indexOf(a);
        const indexB = PRIMARY_SPORTS.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
      })
      .map((sportLabel) => ({
        id: sportLabel.toLowerCase().replace(/\s+/g, '-'),
        label: sportLabel,
        value: sportLabel.toLowerCase(),
        icon: iconMap[sportLabel],
      }));

    return [
      { id: 'all-sports', label: 'All Sports', value: 'all' },
      ...mappedSports
    ];
  }, [filterOptionsData]);

  const eventTypeOptions = useMemo(() => {
    const backendTypes = filterOptionsData?.eventTypes || [];

    const getEventIcon = (eventType: string): string | undefined => {
      const eventTypeLower = eventType.toLowerCase().replace(/\s+/g, '');
      const iconMap: Record<string, string> = {
        'tournament': 'tournamentIcon',
        'social': 'socialIcon',
        'class': 'classIcon',
        'training': 'trainingIcon',
      };
      return iconMap[eventTypeLower];
    };

    const mappedTypes = backendTypes.map((type, index) => ({
      id: `event-type-${index}`,
      label: type,
      value: type.toLowerCase(),
      icon: getEventIcon(type),
    }));

    return [
      { id: 'all-event-types', label: 'All Events', value: 'all' },
      ...mappedTypes
    ];
  }, [filterOptionsData]);

  const sortOptions = [
    { id: 'most-recent', label: 'Most Recent', value: 'most-recent' },
    { id: 'upcoming', label: 'Upcoming', value: 'upcoming' },
    { id: 'most-booked', label: 'Most Booked', value: 'most-booked' },
    { id: 'alphabetical', label: 'A-Z', value: 'alphabetical' },
  ];

  const handleSportToggle = (id: string) => {
    setSelectedSports((prev) => {
      if (id === 'all-sports') return ['all-sports'];
      let next = prev.filter(i => i !== 'all-sports');
      if (next.includes(id)) {
        next = next.filter(i => i !== id);
      } else {
        next.push(id);
      }
      return next.length === 0 ? ['all-sports'] : next;
    });
  };

  const handleEventTypeToggle = (id: string) => {
    setSelectedEventTypes((prev) => {
      if (id === 'all-event-types') return ['all-event-types'];
      let next = prev.filter(i => i !== 'all-event-types');
      if (next.includes(id)) {
        next = next.filter(i => i !== id);
      } else {
        next.push(id);
      }
      return next.length === 0 ? ['all-event-types'] : next;
    });
  };

  const handleSortToggle = (sortId: string) => {
    setSelectedSortBy([sortId]);
  };

  const selectDate = (fullDate: string | null) => {
    setDateFilters(prev =>
      prev.map(f => ({ ...f, isSelected: f.fullDate === fullDate })),
    );
  };

  const events = useMemo(() => data?.data?.events || [], [data?.data?.events]);
  const totalCount = data?.data?.pagination?.totalCount ?? events.length;

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // Filter by period
    if (selectedPeriod !== 'all-time') {
      let startDate: Date = todayStart;
      let endDate: Date = todayEnd;
      
      if (selectedPeriod === 'today') {
        startDate = todayStart;
        endDate = todayEnd;
      } else if (selectedPeriod === 'this-week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
        startDate = new Date(now.getFullYear(), now.getMonth(), diff);
        startDate.setHours(0, 0, 0, 0);
        endDate = todayEnd;
      } else if (selectedPeriod === 'this-month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = todayEnd;
      } else if (selectedPeriod === 'last-6-months') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        endDate = todayEnd;
      }

      filtered = filtered.filter(event => {
        if (!event.eventDateTime) return false;
        const eventDate = new Date(event.eventDateTime);
        return eventDate >= startDate && eventDate <= endDate;
      });
    }

    // Filter by sports
    const activeSports = selectedSports.filter(id => id !== 'all-sports');
    if (activeSports.length > 0) {
      filtered = filtered.filter((event) =>
        event.eventSports?.some((sport) =>
          activeSports.includes(sport.toLowerCase()),
        ),
      );
    }

    // Filter by event type
    const activeEventTypes = selectedEventTypes.filter(id => id !== 'all-event-types');
    if (activeEventTypes.length > 0) {
      filtered = filtered.filter((event) => {
        const eventTypeLower = event.eventType?.toLowerCase() || '';
        return eventTypeOptions.some(opt =>
          activeEventTypes.includes(opt.id) && opt.label.toLowerCase() === eventTypeLower
        );
      });
    }

    // Filter by date (include recurring events that occur on the selected date)
    // Only apply date filter if not showing "All Time" or if a date is explicitly selected
    const selectedDate = dateFilters.find((f) => f.isSelected)?.fullDate;
    if (selectedDate && (selectedPeriod === 'all-time' || selectedPeriod === 'today')) {
      const selectedDateObj = /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)
        ? (() => { const [y, m, d] = selectedDate.split('-').map(Number); return new Date(y, m - 1, d); })()
        : new Date(selectedDate);
      filtered = filtered
        .filter((event) => {
          if (!event.eventDateTime) return false;
          const isRecurring = event.eventFrequency && event.eventFrequency.length > 0 && event.eventFrequency[0] !== 'custom';
          if (isRecurring) {
            return isRecurringEventOnDate(event, selectedDateObj);
          }
          const eventDate = new Date(event.eventDateTime);
          const eDateStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
          const selDateStr = selectedDate.startsWith('2') ? selectedDate.split('T')[0].split(' ')[0] : selectedDate;
          return eDateStr === selDateStr;
        })
        .map((event) => {
          const isRecurring = event.eventFrequency && event.eventFrequency.length > 0 && event.eventFrequency[0] !== 'custom';
          if (isRecurring && isRecurringEventOnDate(event, selectedDateObj)) {
            return { ...event, eventDateTime: getRecurringEventInstanceDateTime(event, selectedDateObj) };
          }
          return event;
        });
    }

    // Sort events
    const sortBy = selectedSortBy[0];
    switch (sortBy) {
      case 'upcoming':
        filtered.sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());
        break;
      case 'most-booked':
        filtered.sort((a, b) => (b.eventTotalAttendNumber ?? 0) - (a.eventTotalAttendNumber ?? 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.eventName.localeCompare(b.eventName));
        break;
      case 'most-recent':
      default:
        // Chronological: earliest date first (e.g. March 12 before March 16)
        filtered.sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());
        break;
    }

    return filtered;
  }, [events, selectedSports, selectedEventTypes, selectedSortBy, dateFilters, selectedPeriod]);

  const handleEventPress = (eventId: string) => {
    navigation.navigate('OrganiserAnalyticsEventDetails', { eventId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isLoading ? (
        <FlexView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </FlexView>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.headerCard}>
              <FlexView flexDirection="row" alignItems="center" justifyContent="space-between">
                <TextDs size={14} weight="bold" color="black">
                  Events Hosted
                </TextDs>
                <TouchableOpacity
                  style={styles.periodButton}
                  onPress={() => setIsPeriodPickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <TextDs size={12} weight="regular" color="blueGray">
                    {periodOptions.find((opt) => opt.value === selectedPeriod)?.label || 'All Time'}
                  </TextDs>
                  <ChevronDown size={14} color={colors.text.blueGray} />
                </TouchableOpacity>
              </FlexView>
              <TextDs size={20} weight="bold" color="blueGray">
                {totalCount}
              </TextDs>
            </Card>

            {/* Horizontally scrollable filters row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersRow}
              contentContainerStyle={styles.filtersRowInner}
            >
              <FilterDropdown
                label="Sports"
                options={sportsOptions}
                selectedIds={selectedSports}
                onToggle={handleSportToggle}
                align="left"
              />
              <FilterDropdown
                label="Event Type"
                options={eventTypeOptions}
                selectedIds={selectedEventTypes}
                onToggle={handleEventTypeToggle}
                align="left"
              />
              <FilterDropdown
                label="Sort By"
                options={sortOptions}
                selectedIds={selectedSortBy}
                onToggle={handleSortToggle}
                align="right"
              />
            </ScrollView>

            {/* Date Filter below filters - extend to full width */}
            <View style={styles.dateFilterWrapper}>
              <DateFilter dates={dateFilters} onSelectDate={selectDate} />
            </View>

            <FlexView style={styles.cardsList}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.eventId}
                    id={event.eventId}
                    event={event as any}
                    onPress={handleEventPress}
                    onBookmark={() => { }}
                    showRevenue
                  />
                ))
              ) : (
                <TextDs size={14} weight="regular" color="tertiary" align="center">
                  No events found yet.
                </TextDs>
              )}
            </FlexView>
          </ScrollView>
        </>
      )}

      {/* All Time period picker modal */}
      <Modal
        visible={isPeriodPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPeriodPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.periodOverlay}
          activeOpacity={1}
          onPress={() => setIsPeriodPickerVisible(false)}
        >
          <FlexView style={styles.periodMenu}>
            {periodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.periodItem,
                  selectedPeriod === option.value && styles.periodItemActive,
                ]}
                onPress={() => {
                  setSelectedPeriod(option.value);
                  setIsPeriodPickerVisible(false);
                  if (option.value === 'all-time') {
                    setDateFilters(prev => prev.map(f => ({ ...f, isSelected: false })));
                  }
                }}
                activeOpacity={0.7}
              >
                <TextDs
                  size={14} weight="regular"
                  color={selectedPeriod === option.value ? 'primary' : 'black'}
                >
                  {option.label}
                </TextDs>
              </TouchableOpacity>
            ))}
          </FlexView>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
