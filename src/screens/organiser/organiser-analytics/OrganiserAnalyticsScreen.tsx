import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { FlexView, ImageDs, TextDs } from '@components';
import { Card } from '@components/global/Card';
import { FilterDropdown } from '@components/global/filter-dropdown';
import { EventCard } from '@components/global/EventCard';
import { DateFilter } from '@components';
import { useOrganiserBookingsAnalytics } from '@hooks/organiser';
import { useFilterOptions } from '@hooks';
import type { OrganiserBookingsAnalyticsEvent } from '@services';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserAnalyticsScreen.styles';
import { getDateFilters } from '@screens/home/context/Home.data';
import type { DateFilter as DateFilterType } from '@screens/home/Home.types';
import { ChevronDown } from 'lucide-react-native';

type TNavigation = NativeStackNavigationProp<RootStackParamList, 'OrganiserAnalytics'>;

const mapBookingEventToEventCard = (event: OrganiserBookingsAnalyticsEvent) => ({
  eventId: event.eventId,
  mongoId: event.eventId,
  eventName: event.title,
  eventImages: [event.eventImage || 'https://via.placeholder.com/150'],
  eventVideo: null,
  eventType: (event.eventType || 'social').toLowerCase(),
  eventSports: event.sports || [],
  eventDateTime: event.dateTime,
  eventFrequency: [],
  eventLocation: event.address || 'Location TBD',
  eventDescription: '',
  eventGender: null,
  eventSportsLevel: null,
  eventMinAge: null,
  eventMaxAge: null,
  eventLevelRestriction: null,
  eventMaxGuest: event.participantsCount || 0,
  eventPricePerGuest: event.price || 0,
  IsPrivateEvent: false,
  eventOurGuestAllowed: false,
  eventApprovalReq: false,
  eventRegistrationStartTime: null,
  eventRegistrationEndTime: null,
  eventStatus: 'upcoming',
  eventCreatorEmail: '',
  eventCreatorName: '',
  eventCreatorProfilePic: null,
  eventTotalAttendNumber: event.bookedCount || 0,
  createdAt: '',
  updatedAt: '',
  creator: null,
  participants: (event.participants || []).map((participant) => ({
    userId: participant.userId,
    userType: 'player',
    email: '',
    mobileNumber: '',
    profilePic: participant.profilePic || null,
    fullName: participant.fullName,
  })),
  participantsCount: event.participantsCount || 0,
  waitlist: [],
  waitlistCount: 0,
  spotsInfo: {
    totalSpots: event.participantsCount || 0,
    spotsBooked: event.bookedCount || 0,
    spotsLeft: Math.max(0, (event.participantsCount || 0) - (event.bookedCount || 0)),
    spotsFull: (event.participantsCount || 0) - (event.bookedCount || 0) <= 0,
  },
  counts: null,
  userJoinStatus: null,
  availableSpots: Math.max(0, (event.participantsCount || 0) - (event.bookedCount || 0)),
  isFull: (event.participantsCount || 0) - (event.bookedCount || 0) <= 0,
});

export const OrganiserAnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<TNavigation>();
  const [isPeriodPickerVisible, setIsPeriodPickerVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedSports, setSelectedSports] = useState<string[]>(['all-sports']);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['all-event-types']);
  const [dateFilters, setDateFilters] = useState<DateFilterType[]>(getDateFilters());

  const selectedDate = useMemo(
    () => dateFilters.find((filter) => filter.isSelected)?.fullDate,
    [dateFilters],
  );

  const periodToApiMap: Record<string, 'today' | 'lastWeek' | 'thisMonth' | '6months' | 'lifetime'> = {
    'all-time': 'lifetime',
    'today': 'today',
    'this-week': 'lastWeek',
    'this-month': 'thisMonth',
    'last-6-months': '6months',
  };

  const primarySelectedSport = selectedSports.find((id) => id !== 'all-sports');

  const analyticsFilters = useMemo(() => {
    const startDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : undefined;

    return {
      revenuePeriod: periodToApiMap[selectedPeriod] || 'lifetime',
      sport: primarySelectedSport ? primarySelectedSport.replace(/-/g, ' ') : undefined,
      startDate,
      endDate: startDate,
    };
  }, [selectedPeriod, primarySelectedSport, selectedDate]);

  const { data, isLoading, isFetching } = useOrganiserBookingsAnalytics(analyticsFilters);

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
    const defaultTypes = ['Social', 'Competitive', 'Training', 'Tournament'];
    const backendTypes = filterOptionsData?.eventTypes || [];
    const combinedTypes = [...defaultTypes];
    backendTypes.forEach(bt => {
      if (!combinedTypes.some(ct => ct.toLowerCase() === bt.toLowerCase())) {
        combinedTypes.push(bt);
      }
    });

    const mappedTypes = combinedTypes.map((type, index) => ({
      id: `event-type-${index}`,
      label: type,
      value: type.toLowerCase(),
    }));

    return [
      { id: 'all-event-types', label: 'All Events', value: 'all' },
      ...mappedTypes
    ];
  }, [filterOptionsData]);

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

  const selectDate = (fullDate: string | null) => {
    setDateFilters(prev =>
      prev.map(f => ({ ...f, isSelected: f.fullDate === fullDate })),
    );
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('OrganiserAnalyticsEventDetails', { eventId });
  };

  const events = useMemo(
    () => (data?.events || []).map(mapBookingEventToEventCard),
    [data?.events],
  );

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    const normalizeForCompare = (value: string) =>
      value.toLowerCase().replace(/[_\s]+/g, '-').trim();

    // Filter by sports
    const activeSports = selectedSports.filter(id => id !== 'all-sports');
    if (activeSports.length > 0) {
      filtered = filtered.filter((event) =>
        event.eventSports?.some((sport) => {
          const normalizedSport = normalizeForCompare(sport);
          return activeSports.includes(normalizedSport);
        },
        ),
      );
    }
 
    // Filter by event type
    const activeEventTypes = selectedEventTypes.filter(id => id !== 'all-event-types');
    if (activeEventTypes.length > 0) {
      const activeTypeValues = eventTypeOptions
        .filter((option) => activeEventTypes.includes(option.id))
        .map((option) => option.value);

      filtered = filtered.filter((event) => {
        const eventTypeLower = (event.eventType || '').toLowerCase();
        return activeTypeValues.includes(eventTypeLower);
      });
    }

    // Filter by date
    if (selectedDate) {
      const selectedDateOnly = new Date(selectedDate).toISOString().split('T')[0];
      filtered = filtered.filter((event) => {
        if (!event.eventDateTime) return false;
        const eventDateOnly = new Date(event.eventDateTime).toISOString().split('T')[0];
        return eventDateOnly === selectedDateOnly;
      });
    }

    // Show events from most recent to least recent.
    filtered.sort(
      (a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime(),
    );

    return filtered;
  }, [events, selectedSports, selectedEventTypes, selectedDate, eventTypeOptions]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {isLoading || isFetching ? (
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
            <Card style={styles.revenueCard}>
              <FlexView flexDirection="row" alignItems="center" justifyContent="space-between">
                <TextDs size={14} weight="semibold" color="black">
                  Total Revenue
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
              <FlexView flexDirection="row" alignItems="center" gap={spacing.xs}>
                <ImageDs image="DhiramIcon" size={16} />
                <TextDs size={18} weight="semibold" color="blueGray">
                  {data?.totalRevenue ?? 0}
                </TextDs>
              </FlexView>
            </Card>

            <FlexView style={styles.filtersRow}>
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
            </FlexView>

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
                  />
                ))
              ) : (
                <TextDs size={14} weight="regular" color="tertiary" align="center">
                  No bookings found yet.
                </TextDs>
              )}
            </FlexView>
          </ScrollView>
        </>
      )}

      {/* Period Picker Modal */}
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
