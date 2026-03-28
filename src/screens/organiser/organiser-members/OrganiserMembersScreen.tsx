import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation';
import { Card } from '@components/global/Card';
import { FlexView, ImageDs, TextDs, Avatar } from '@components';
import { FilterDropdown } from '@components/global/filter-dropdown';
import { useOrganiserAttendees } from '@hooks/organiser';
import { useOrganiserMembers } from '@hooks/organiser';
import { resolveImageUri } from '@utils/image-utils';
import { colors, spacing } from '@theme';
import { styles } from './style/OrganiserMembersScreen.styles';

type MemberRow = {
  userId: number;
  fullName: string;
  profilePic: string | null;
  totalBookedEvents: number;
  totalBookingAmount: number;
  lastBookedAt: string | null;
  sports?: string[];
  sport1?: string;
  sport2?: string;
};

export const OrganiserMembersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isPeriodPickerVisible, setIsPeriodPickerVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedSports, setSelectedSports] = useState<string[]>(['all-sports']);
  const [selectedSortBy, setSelectedSortBy] = useState<string[]>(['most-recent']);

  const periodOptions = [
    { label: 'All Time', value: 'all-time' },
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last 6 Months', value: 'last-6-months' },
  ];

  const sportsOptions = [
    { id: 'all-sports', label: 'All Sports', value: 'all' },
    { id: 'football', label: 'Football', value: 'football', icon: 'footballIcon' },
    { id: 'tennis', label: 'Tennis', value: 'tennis', icon: 'tennisIcon' },
    { id: 'table-tennis', label: 'Table Tennis', value: 'table-tennis', icon: 'tableTennisIcon' },
    { id: 'basketball', label: 'Basketball', value: 'basketball', icon: 'basketballIcon' },
    { id: 'badminton', label: 'Badminton', value: 'badminton', icon: 'badmintonIcon' },
    { id: 'cricket', label: 'Cricket', value: 'cricket', icon: 'cricketIcon' },
    { id: 'indoor-cricket', label: 'Indoor Cricket', value: 'indoor-cricket', icon: 'indoorCricketIcon' },
    { id: 'padel', label: 'Padel', value: 'padel', icon: 'padelIcon' },
    { id: 'pickleball', label: 'Pickleball', value: 'pickleball', icon: 'pickleballIcon' },
    { id: 'pilates', label: 'Pilates', value: 'pilates', icon: 'pilatesIcon' },
    { id: 'running', label: 'Running', value: 'running', icon: 'runningIcon' },
  ];

  const periodToApiMap: Record<string, string> = {
    'all-time': 'lifetime',
    'today': 'today',
    'this-week': 'lastWeek',
    'this-month': 'thisMonth',
    'last-6-months': '6months',
  };

  const activeSport = useMemo(() => {
    const id = selectedSports.find((s) => s !== 'all-sports');
    return id && id !== 'all' ? sportsOptions.find((o) => o.id === id)?.value : undefined;
  }, [selectedSports]);

  const { data, isLoading } = useOrganiserAttendees(1, 200);
  const { data: membersData } = useOrganiserMembers(1, 200, {
    period: periodToApiMap[selectedPeriod] || 'lifetime',
    sport: activeSport,
  });

  const sortOptions = [
    { id: 'most-recent', label: 'Most Recent', value: 'most-recent' },
    { id: 'most-bookings', label: 'Most Bookings', value: 'most-bookings' },
    { id: 'highest-amount', label: 'Highest Amount', value: 'highest-amount' },
    { id: 'alphabetical', label: 'A-Z', value: 'alphabetical' },
  ];

  const handleSportToggle = (sportId: string) => {
    setSelectedSports((prev) => {
      if (sportId === 'all-sports') return ['all-sports'];
      const next = prev.filter((id) => id !== 'all-sports');
      if (next.includes(sportId)) {
        const filtered = next.filter((id) => id !== sportId);
        return filtered.length === 0 ? ['all-sports'] : filtered;
      }
      return [...next, sportId];
    });
  };

  const handleSortToggle = (sortId: string) => {
    setSelectedSortBy([sortId]);
  };

  const members = useMemo<MemberRow[]>(() => {
    const membersById = new Map<number, any>();
    for (const member of membersData?.data?.members || []) {
      membersById.set(Number(member.userId ?? 0), member);
    }

    const attendees = data?.data?.attendees || [];
    return attendees.map((member: any) => ({
      ...(membersById.get(Number(member.userId ?? 0)) || {}),
      userId: Number(member.userId ?? 0),
      fullName: String(member.fullName ?? member.name ?? ''),
      profilePic: member.profilePic ?? member.profile_pic ?? null,
      totalBookedEvents: Number(
        membersById.get(Number(member.userId ?? 0))?.organiserBookedEvents ??
          membersById.get(Number(member.userId ?? 0))?.organiser_booked_events ??
          member.organiserBookedEvents ??
          member.organiser_booked_events ??
          member.joinedEventsCount ??
          membersById.get(Number(member.userId ?? 0))?.totalBookedEvents ??
          membersById.get(Number(member.userId ?? 0))?.total_booked_events ??
          member.totalBookedEvents ??
          member.total_booked_events ??
          0,
      ),
      totalBookingAmount: Number(
        membersById.get(Number(member.userId ?? 0))?.organiserBookingAmount ??
          membersById.get(Number(member.userId ?? 0))?.organiser_booking_amount ??
          member.organiserBookingAmount ??
          member.organiser_booking_amount ??
          membersById.get(Number(member.userId ?? 0))?.totalBookingAmount ??
          membersById.get(Number(member.userId ?? 0))?.total_booking_amount ??
          member.totalBookingAmount ??
          member.total_booking_amount ??
          0,
      ),
      lastBookedAt:
        membersById.get(Number(member.userId ?? 0))?.lastBookedAt ??
        membersById.get(Number(member.userId ?? 0))?.last_booked_at ??
        membersById.get(Number(member.userId ?? 0))?.organiserLastBookedAt ??
        membersById.get(Number(member.userId ?? 0))?.organiser_last_booked_at ??
        member.lastBookedAt ??
        member.last_booked_at ??
        member.organiserLastBookedAt ??
        member.organiser_last_booked_at ??
        null,
      sports: Array.isArray(member.sports) ? member.sports : undefined,
      sport1: member.sport1,
      sport2: member.sport2,
    }));
  }, [data?.data?.attendees, membersData?.data?.members]);

  const filteredMembers = useMemo(() => {
    let filtered = [...members];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    if (selectedPeriod !== 'all-time') {
      let startDate: Date = todayStart;
      let endDate: Date = todayEnd;

      if (selectedPeriod === 'this-week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(now.getFullYear(), now.getMonth(), diff);
        startDate.setHours(0, 0, 0, 0);
      } else if (selectedPeriod === 'this-month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (selectedPeriod === 'last-6-months') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      }

      filtered = filtered.filter((member) => {
        if (!member.lastBookedAt) return false;
        const bookingDate = new Date(member.lastBookedAt);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

    const activeSports = selectedSports.filter((id) => id !== 'all-sports');
    if (activeSports.length > 0) {
      filtered = filtered.filter((member) => {
        const memberSports = [member.sports, member.sport1, member.sport2]
          .flat()
          .filter(Boolean)
          .map((s) => String(s).toLowerCase());
        if (memberSports.length === 0) return true;
        const optionValues = sportsOptions
          .filter((o) => activeSports.includes(o.id))
          .map((o) => o.value.toLowerCase());
        return optionValues.some((value) => memberSports.includes(value));
      });
    }

    const sortBy = selectedSortBy[0];
    switch (sortBy) {
      case 'most-bookings':
        filtered.sort((a, b) => b.totalBookedEvents - a.totalBookedEvents);
        break;
      case 'highest-amount':
        filtered.sort((a, b) => b.totalBookingAmount - a.totalBookingAmount);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'most-recent':
      default:
        filtered.sort((a, b) => {
          const aDate = a.lastBookedAt ? new Date(a.lastBookedAt).getTime() : 0;
          const bDate = b.lastBookedAt ? new Date(b.lastBookedAt).getTime() : 0;
          return bDate - aDate;
        });
        break;
    }

    return filtered;
  }, [members, selectedPeriod, selectedSortBy, selectedSports, sportsOptions]);

  const totalCount = filteredMembers.length;

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
                      profilePic: member.profilePic ?? undefined,
                    })
                  }
                >
                  <FlexView style={styles.memberRow}>
                    <Avatar
                      imageUri={resolveImageUri(member.profilePic) ?? undefined}
                      fullName={member.fullName}
                      size="lg"
                    />
                    <FlexView style={styles.memberInfo}>
                      <TextDs size={14} weight="regular" color="primary">
                        {member.fullName}
                      </TextDs>
                      <TextDs size={14} weight="regular" color="secondary">
                        Booked: {member.totalBookedEvents} Events
                      </TextDs>
                    </FlexView>
                  </FlexView>
                  <FlexView style={styles.memberPrice}>
                    <ImageDs image="DhiramIcon" style={styles.priceIcon} />
                    <TextDs size={16} weight="bold" color="blueGray">
                      {member.totalBookingAmount}
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
                  size={14}
                  weight="regular"
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
