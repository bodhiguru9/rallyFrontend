import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { TextDs } from '@designSystem/atoms/TextDs';
import { FlexView } from '@designSystem/atoms/FlexView';
import { Card } from '@components/global/Card';
import { FilterDropdown } from '@components/global/filter-dropdown';
import { EventCard } from '@components/global/EventCard';
import { useOrganiserEvents } from '@hooks/use-organiser-events';
import { useAuthStore } from '@store/auth-store';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserEventsHostedScreen.styles';

type TNavigation = NativeStackNavigationProp<RootStackParamList, 'OrganiserEventsHosted'>;

export const OrganiserEventsHostedScreen: React.FC = () => {
  const navigation = useNavigation<TNavigation>();
  const userId = useAuthStore((state) => state.user?.userId || 0);
  const { data, isLoading } = useOrganiserEvents(userId, 1, 20, { enabled: userId > 0 });

  const [isPeriodPickerVisible, setIsPeriodPickerVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>(['most-recent']);

  const periodOptions = [
    { label: 'All Time', value: 'all-time' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last 6 Months', value: 'last-6-months' },
  ];

  const sportsOptions = [
    { id: 'football', label: 'Football', value: 'football' },
    { id: 'basketball', label: 'Basketball', value: 'basketball' },
    { id: 'cricket', label: 'Cricket', value: 'cricket' },
    { id: 'tennis', label: 'Tennis', value: 'tennis' },
    { id: 'badminton', label: 'Badminton', value: 'badminton' },
    { id: 'volleyball', label: 'Volleyball', value: 'volleyball' },
    { id: 'swimming', label: 'Swimming', value: 'swimming' },
    { id: 'running', label: 'Running', value: 'running' },
  ];

  const eventTypeOptions = [
    { id: 'social', label: 'Social', value: 'social' },
    { id: 'competitive', label: 'Competitive', value: 'competitive' },
    { id: 'training', label: 'Training', value: 'training' },
    { id: 'tournament', label: 'Tournament', value: 'tournament' },
  ];

  const sortOptions = [
    { id: 'most-recent', label: 'Most Recent', value: 'most-recent' },
    { id: 'upcoming', label: 'Upcoming', value: 'upcoming' },
    { id: 'most-booked', label: 'Most Booked', value: 'most-booked' },
    { id: 'alphabetical', label: 'A-Z', value: 'alphabetical' },
  ];

  const handleSportToggle = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((id) => id !== sportId) : [...prev, sportId],
    );
  };

  const handleEventTypeToggle = (typeId: string) => {
    setSelectedEventTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId],
    );
  };

  const handleSortToggle = (sortId: string) => {
    setSelectedSortBy([sortId]);
  };

  const events = useMemo(() => data?.data?.events || [], [data?.data?.events]);
  const totalCount = data?.data?.pagination?.totalCount ?? events.length;

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by sports
    if (selectedSports.length > 0) {
      filtered = filtered.filter((event) =>
        event.eventSports?.some((sport) =>
          selectedSports.includes(sport.toLowerCase()),
        ),
      );
    }

    // Filter by event type
    if (selectedEventTypes.length > 0) {
      filtered = filtered.filter((event) =>
        selectedEventTypes.includes(event.eventType?.toLowerCase() || ''),
      );
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
        // Keep original order (most recent)
        break;
    }

    return filtered;
  }, [events, selectedSports, selectedEventTypes, selectedSortBy]);

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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.headerCard}>
            <FlexView flexDirection="row" alignItems="center" justifyContent="space-between">
              <TextDs size={14} weight="regular" color="black">
                Events Hosted
              </TextDs>
              <TouchableOpacity
                style={styles.periodButton}
                onPress={() => setIsPeriodPickerVisible(true)}
                activeOpacity={0.8}
              >
                <TextDs size={14} weight="regular" color="black">
                  {periodOptions.find((opt) => opt.value === selectedPeriod)?.label || 'All Time'}
                </TextDs>
              </TouchableOpacity>
            </FlexView>
            <TextDs size={14} weight="regular" color="blueGray">
              {totalCount}
            </TextDs>
          </Card>

          <FlexView flexDirection="row" gap={spacing.sm} style={styles.filtersRow}>
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
              align="left"
            />
          </FlexView>

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
                No events found yet.
              </TextDs>
            )}
          </FlexView>
        </ScrollView>
      )}

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
