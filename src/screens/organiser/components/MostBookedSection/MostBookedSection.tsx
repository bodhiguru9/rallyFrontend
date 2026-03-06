import React, { useMemo } from 'react';
import { ScrollView, Image, ActivityIndicator } from 'react-native';
import { colors, typography } from '@theme';
import type { MostBookedSectionProps } from './MostBookedSection.types';
import type { MostBookedMember } from '../../data/organiserDashboard.data';
import { styles } from './style/MostBookedSection.styles';
import { TextDs, FlexView, ImageDs } from '@components';
import { useOrganiserMembers } from '@hooks/organiser';

export const MostBookedSection: React.FC<MostBookedSectionProps> = ({
  members: propMembers,
}) => {
  const { data: membersData, isLoading, error } = useOrganiserMembers(1, 20);

  // Transform API response to MostBookedMember format
  const apiMembers: MostBookedMember[] = useMemo(() => {
    if (!membersData?.data?.members) {
      return [];
    }
    return membersData.data.members.map((member) => ({
      id: member.userId?.toString() || '',
      name: member.fullName || '',
      avatar: member.profilePic || undefined,
    }));
  }, [membersData]);

  // Use API data if available, otherwise fall back to prop
  const members = apiMembers.length > 0 ? apiMembers : (propMembers || []);

  if (isLoading && !propMembers) {
    return (
      <FlexView style={styles.container}>
        <TextDs size={16} weight="semibold">Most Booked</TextDs>
        <FlexView style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </FlexView>
      </FlexView>
    );
  }

  if (error && !propMembers) {
    return (
      <FlexView style={styles.container}>
        <TextDs size={16} weight="semibold">Most Booked</TextDs>
        <FlexView style={{ padding: 20, alignItems: 'center' }}>
          <TextDs style={{ color: colors.status.error, fontSize: typography.fontSize[12] }}>
            Failed to load users
          </TextDs>
        </FlexView>
      </FlexView>
    );
  }

  if (!members || members.length === 0) {
    return (
      <FlexView style={styles.container}>
        <TextDs size={16} weight="semibold">Most Booked</TextDs>
        <FlexView style={{ padding: 20, alignItems: 'center' }}>
          <TextDs style={{ color: colors.text.tertiary, fontSize: typography.fontSize[12] }}>
            No users found
          </TextDs>
        </FlexView>
      </FlexView>
    );
  }

  return (
    <FlexView style={styles.container}>
      <FlexView style={styles.headerRow}>
        <TextDs size={16} weight="semibold">Most Booked</TextDs>
      </FlexView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {members.map((member) => (
          <FlexView key={member.id} style={styles.memberItem}>
            <FlexView style={styles.avatarContainer}>
              {member.avatar ? (
                <Image source={{ uri: member.avatar }} style={styles.avatar} />
              ) : (
                <ImageDs image="UserGray" style={styles.avatar} />
              )}
            </FlexView>
            <TextDs style={styles.memberName} numberOfLines={1}>
              {member.name}
            </TextDs>
          </FlexView>
        ))}
      </ScrollView>
    </FlexView>
  );
};

