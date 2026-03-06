import React, { useState, useMemo } from 'react';
import { TextDs,  FlexView } from '@components';
import {FlatList, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '@theme';
import { SearchInput } from '@components/global';
import type { RootStackParamList } from '@navigation';
import { FollowerItem } from './components/FollowerItem';
import type { Follower } from './AllFollowersScreen.types';
import { styles } from './style/AllFollowersScreen.styles';
import { useAuthStore } from '@store';
import { useOrganiserFollowers } from '@hooks/organiser';
import { organiserService } from '@services/organiser-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AllFollowersScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AllFollowers'
>;

export const AllFollowersScreen: React.FC = () => {
  const navigation = useNavigation<AllFollowersScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const organiserId = useAuthStore((s) => s.user?.userId || 0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useOrganiserFollowers(organiserId, 1, 20, { enabled: organiserId > 0 });

  const followers: Follower[] = useMemo(() => {
    const raw = (data as any)?.data?.followers || (data as any)?.data?.data?.followers || (data as any)?.data?.users || (data as any)?.data?.members || [];
    if (!Array.isArray(raw)) {return [];}
    return raw.map((u: any) => ({
      userId: Number(u.userId ?? u.id),
      fullName: u.fullName || u.name || '',
      profilePic: u.profilePic ?? u.avatar ?? null,
    }));
  }, [data]);

  const filteredFollowers = useMemo(() => {
    if (!searchQuery.trim()) {
      return followers;
    }
    const query = searchQuery.toLowerCase();
    return followers.filter((follower) => (follower.fullName ?? follower.name ?? '').toLowerCase().includes(query));
  }, [followers, searchQuery]);

  const removeMutation = useMutation({
    mutationFn: (userId: number) => organiserService.removeOrganiserMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organiser-followers'] });
    },
  });

  const handleRemove = (userId: number) => {
    Alert.alert('Remove', 'Are you sure you want to remove this subscriber?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeMutation.mutate(userId),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Back Button */}
      <FlexView style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: spacing.base }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TextDs style={styles.headerTitle}>All Followers</TextDs>
      </FlexView>

      {/* Search Bar */}
      <FlexView style={styles.searchContainer}>
        <SearchInput
          placeholder="Search Subscribers"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </FlexView>

      {/* Follower List */}
      <FlatList
        data={filteredFollowers}
        keyExtractor={(item) => String(item.userId ?? item.id ?? '')}
        renderItem={({ item }) => (
          <FollowerItem follower={item} onRemove={handleRemove} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <FlexView style={styles.emptyState}>
            <TextDs style={styles.emptyStateText}>
              {isLoading ? 'Loading...' : 'No followers found'}
            </TextDs>
          </FlexView>
        }
      />
    </SafeAreaView>
  );
};

