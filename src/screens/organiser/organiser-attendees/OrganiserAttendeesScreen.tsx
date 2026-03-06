import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@components/global/Card';
import { FlexView, ImageDs, TextDs, Avatar, FilterDropdown } from '@components';
import { FilterChip } from '@components/private/home/FilterChip';
import { useOrganiserAttendees } from '@hooks/organiser';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserAttendeesScreen.styles';

export const OrganiserAttendeesScreen: React.FC = () => {
  const { data, isLoading } = useOrganiserAttendees(1, 20);
  const [isPeriodPickerVisible, setIsPeriodPickerVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedSortFilter, setSelectedSortFilter] = useState<string[]>([]);

  const sportsOptions = [
    { id: 'football', label: 'Football', icon: 'FootballIcon', value: 'football' },
    { id: 'basketball', label: 'Basketball', icon: 'BasketballIcon', value: 'basketball' },
    { id: 'tennis', label: 'Tennis', icon: 'TennisIcon', value: 'tennis' },
    { id: 'volleyball', label: 'Volleyball', icon: 'VolleyballIcon', value: 'volleyball' },
    { id: 'padel', label: 'Padel', icon: 'PadelIcon', value: 'padel' },
  ];

  const sortOptions = [
    { id: 'most-spent', label: 'Most Spent', value: 'most-spent' },
    { id: 'most-booked', label: 'Most Booked', value: 'most-booked' },
  ];
  const periodOptions = [
    { label: 'All Time', value: 'all-time' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last 6 Months', value: 'last-6-months' },
  ];

  const attendees = useMemo(() => data?.data?.attendees || [], [data?.data?.attendees]);
  const totalCount =
    data?.data?.totalAttendees ?? data?.data?.pagination?.totalCount ?? attendees.length;
  const totalJoinedEvents = useMemo(
    () => attendees.reduce((sum, a) => sum + (a.joinedEventsCount ?? 0), 0),
    [attendees],
  );

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
              <TextDs size={14} weight="bold" color="black">
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
            <TextDs size={14} weight="regular" color="secondary">
              Total Joined Events: {totalJoinedEvents}
            </TextDs>
          </Card>

          <FlexView flexDirection="row" gap={spacing.sm} style={styles.filtersRow}>
            <FilterDropdown
              label="All Sports"
              options={sportsOptions}
              selectedIds={selectedSports}
              onToggle={(id) => {
                setSelectedSports((prev) =>
                  prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
                );
              }}
              isMultiSelect={true}
              align="left"
            />
            <FilterDropdown
              label="Sort By"
              options={sortOptions}
              selectedIds={selectedSortFilter}
              onToggle={(id) => {
                setSelectedSortFilter((prev) =>
                  prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
                );
              }}
              isMultiSelect={false}
              align="left"
            />
          </FlexView>

          <FlexView style={styles.cardsList}>
            {attendees.length > 0 ? (
              attendees.map((member) => (
                <FlexView key={member.userId} style={styles.memberCard}>
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
                        Joined: {member.joinedEventsCount ?? 0} Events
                      </TextDs>
                    </FlexView>
                  </FlexView>
                  <FlexView style={styles.memberPrice}>
                    <ImageDs image="DhiramIcon" style={styles.priceIcon} />
                    <TextDs size={14} weight="regular" color="primary">
                      {member.totalBookingAmount ?? member.organiserBookingAmount ?? 0}
                    </TextDs>
                  </FlexView>
                </FlexView>
              ))
            ) : (
              <TextDs size={14} weight="regular" color="tertiary" align="center">
                No attendees found yet.
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

