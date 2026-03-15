import React, { useMemo } from 'react';
import { ScrollView, Image, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { colors, typography } from '@theme';
import type { MostBookedSectionProps } from './MostBookedSection.types';
import type { MostBookedMember } from '../../data/organiserDashboard.data';
import { styles } from './style/MostBookedSection.styles';
import { TextDs, FlexView, ImageDs } from '@components';
import { useOrganiserMembers } from '@hooks/organiser';

/**
 * Extract initials from a full name
 * @param name - Full name of the member
 * @returns Initials (max 2 characters)
 */
const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const MostBookedSection: React.FC<MostBookedSectionProps> = ({
  members: propMembers,
  onMemberPress,
}) => {
  const { data: membersData, isLoading, error } = useOrganiserMembers(1, 20);

  // Transform API response to MostBookedMember format + keep full member for onMemberPress
  // Sort by most bookings (totalBookedEvents) so "Most Booked" section shows correct order
  const { apiMembers, apiMembersWithIds } = useMemo(() => {
    if (!membersData?.data?.members) {
      return { apiMembers: [] as MostBookedMember[], apiMembersWithIds: [] as Array<MostBookedMember & { userId: number }> };
    }
    const sorted = [...membersData.data.members].sort(
      (a, b) => (b.totalBookedEvents ?? (b as any).total_booked_events ?? 0) - (a.totalBookedEvents ?? (a as any).total_booked_events ?? 0),
    );
    const mapped = sorted.map((member) => ({
      id: member.userId?.toString() || '',
      name: member.fullName || '',
      avatar: member.profilePic || (member as any).profile_pic || undefined,
      userId: member.userId ?? 0,
    }));
    return {
      apiMembers: mapped.map(({ id, name, avatar }) => ({ id, name, avatar })),
      apiMembersWithIds: mapped,
    };
  }, [membersData]);

  // Use API data if available, otherwise fall back to prop
  const members = apiMembers.length > 0 ? apiMembers : (propMembers || []);
  const membersWithIds = apiMembersWithIds;

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
        {members.map((member, index) => {
          const fullMember = membersWithIds[index];
          const userId = fullMember?.userId ?? (member.id ? parseInt(member.id, 10) : 0);
          const handlePress = () => {
            if (onMemberPress && userId > 0) {
              onMemberPress({
                userId,
                fullName: member.name,
                profilePic: member.avatar,
              });
            }
          };
          const content = (
            <FlexView key={member.id} style={styles.memberItem}>
              <FlexView style={styles.avatarContainer}>
                {member.avatar ? (
                  <Image source={{ uri: member.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <TextDs size={18} weight="semibold" color="primary">
                      {getInitials(member.name)}
                    </TextDs>
                  </View>
                )}
              </FlexView>
              <TextDs style={styles.memberName} numberOfLines={1}>
                {member.name}
              </TextDs>
            </FlexView>
          );
          return onMemberPress && userId > 0 ? (
            <TouchableOpacity key={member.id} onPress={handlePress} activeOpacity={0.7}>
              {content}
            </TouchableOpacity>
          ) : (
            <FlexView key={member.id}>{content}</FlexView>
          );
        })}
      </ScrollView>
    </FlexView>
  );
};

