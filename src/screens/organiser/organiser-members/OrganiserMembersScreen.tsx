import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { Card } from '@components/global/Card';
import { FlexView, ImageDs, TextDs, Avatar } from '@components';
import { FilterDropdown } from '@components/global/filter-dropdown';
import { useOrganiserMembers } from '@hooks/organiser';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserMembersScreen.styles';

export const OrganiserMembersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, isLoading } = useOrganiserMembers(1, 20);
  const [isPeriodPickerVisible, setIsPeriodPickerVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
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

  const sortOptions = [
    { id: 'most-recent', label: 'Most Recent', value: 'most-recent' },
    { id: 'most-bookings', label: 'Most Bookings', value: 'most-bookings' },
    { id: 'highest-amount', label: 'Highest Amount', value: 'highest-amount' },
    { id: 'alphabetical', label: 'A-Z', value: 'alphabetical' },
  ];

  const handleSportToggle = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((id) => id !== sportId) : [...prev, sportId],
    );
  };

  const handleSortToggle = (sortId: string) => {
    setSelectedSortBy([sortId]);
  };

  const members = useMemo(() => data?.data?.members || [], [data?.data?.members]);

  const filteredMembers = useMemo(() => {
    const filtered = [...members];

    // Filter by sports (if any selected)
    // Note: Current API doesn't provide sport info per member
    // In a real implementation, you'd filter based on member.sports or similar
    // For now, sports filter is a UI placeholder

    // Sort members
    const sortBy = selectedSortBy[0];
    switch (sortBy) {
      case 'most-bookings':
        filtered.sort((a, b) => (b.totalBookedEvents ?? 0) - (a.totalBookedEvents ?? 0));
        break;
      case 'highest-amount':
        filtered.sort((a, b) => (b.totalBookingAmount ?? 0) - (a.totalBookingAmount ?? 0));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'most-recent':
      default:
        // Keep original order (most recent)
        break;
    }

    return filtered;
  }, [members, selectedSortBy]);

  const totalCount = data?.data?.totalMembers ?? data?.data?.pagination?.totalCount ?? members.length;

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
                Total Members
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
              label="Sort By"
              options={sortOptions}
              selectedIds={selectedSortBy}
              onToggle={handleSortToggle}
              align="left"
            />
          </FlexView>

          <FlexView style={styles.cardsList}>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <TouchableOpacity
                  key={member.userId}
                  style={styles.memberCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('OrganiserMemberJoinedEvents', {
                      userId: member.userId,
                      fullName: member.fullName,
                      profilePic: member.profilePic,
                    })
                  }
                >
                  <FlexView style={styles.memberRow}>
                    <Avatar
                      imageUri={member.profilePic}
                      fullName={member.fullName}
                      size="lg"
                    />
                    <FlexView style={styles.memberInfo}>
                      <TextDs size={14} weight="regular" color="primary">
                        {member.fullName}
                      </TextDs>
                      <TextDs size={14} weight="regular" color="secondary">
                        Booked: {member.totalBookedEvents ?? 0} Events
                      </TextDs>
                    </FlexView>
                  </FlexView>
                  <FlexView style={styles.memberPrice}>
                    <ImageDs image="DhiramIcon" style={styles.priceIcon} />
                    <TextDs size={14} weight="regular" color="primary">
                      {member.totalBookingAmount ?? 0}
                    </TextDs>
                  </FlexView>
                </TouchableOpacity>
              ))
            ) : (
              <TextDs size={14} weight="regular" color="tertiary" align="center">
                No members found yet.
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
